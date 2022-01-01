let d = new Dialog({
    title: 'Convert to lootable body',
    content: `Sure? This will delete any non-lootable features.`,
    buttons: {
        no: {
            icon: '<i class="fas fa-ban"></i>',
            label: 'Cancel',
        },
        yes: {
            icon: '<i class="fas fa-thumbs-up"></i>',
            label: 'Convert',
            callback: (html) => {
                ConvertTokens();
            },
        },
    },
    default: 'no',
}).render(true);

/**
 * @title Converts the provided token to a lootable sheet
 *
 * @note titleAdapted from dfreds pocketChange Module
 * Originally adappted from the convert-to-lootable.js by @unsoluble, @Akaito, @honeybadger, @kekilla, and @cole.
 *
 * @module lootsheetnpc5e.API.convertToken
 *
 * @param {object} options
 * @param {Token5e} token - the token to convert
 * @param {string} type Type of Lootsheet
 * @param {number} options.chanceOfDamagedItems - (optional) the chance an item is considered damaged from 0 to 1. Uses the setting if undefined
 * @param {number} options.damagedItemsMultiplier - (optional) the amount to reduce the value of a damaged item by. Uses the setting if undefined
 * @param {boolean} options.removeDamagedItems - (optional) if true, removes items that are damaged of common rarity
 */

async function ConvertTokens(
    type = 'loot',
    options = {},
    verbose = false
) {
    for (let token of canvas.tokens.controlled) {

        if (token.actor.data.type === 'character') continue;

        const sheet = token.actor.sheet,
            priorState = sheet._state; // -1 for opened before but now closed, // 0 for closed and never opened // 1 for currently open

        let lootIcon = 'icons/svg/chest.svg';

        let newActorData = {
            flags: {
                core: {
                    sheetClass: 'dnd5e.LootSheetNPC5e',
                },
                lootsheetnpc5e: {
                    lootsheettype: 'Loot',
                },
            },
        };

        if (type && type.toLowerCase() === 'merchant') {
            newActorData.flags.lootsheetnpc5e.lootsheettype = 'Merchant';
            lootIcon = 'icons/svg/coins.svg';
        }

        // Close the old sheet if it's open
        await sheet.close();

        newActorData.items = _getLootableItems(token.actor.items);

        // Delete all items first
        await token.document.actor.deleteEmbeddedDocuments(
            'Item',
            Array.from(token.actor.items.keys())
        );

        // Update actor with the new sheet and items
        await token.document.actor.update(newActorData);

        // Update the document with the overlay icon and new permissions
        await token.document.update({
            overlayEffect: lootIcon,
            vision: false,
            actorData: {
                actor: {
                    flags: {
                        loot: {
                            playersPermission: CONST.ENTITY_PERMISSIONS.OBSERVER,
                        },
                    },
                },
                permission: _updatedUserPermissions(token),
            },
        });

        // Deregister the old sheet class
        token.actor._sheet = null;
        delete token.actor.apps[sheet.appId];

        if (priorState > 0) {
            // Re-draw the updated sheet if it was open
            token.actor.sheet.render(true);
        }
    }
}

/**
 * Update given 'token' to permission 'level'
 *
 * @param {Token5e} token A token object (dfault first selected token)
 *
 * @param {number} level permission level (default 0)
 * @param {Array<User>}
 *
 * @returns {Array<object>}
 *
 * @version 1.0.0
 */
function _updatedUserPermissions(
    token = canvas.tokens.controlled[0],
    level = CONST.ENTITY_PERMISSIONS.OBSERVER || 0,
    lootingUsers = getPlayers(),
) {
    let currentPermissions = duplicate(token.actor.data.permission);

    lootingUsers.forEach((user) => {
        currentPermissions[user.data._id] = level;
    });

    return currentPermissions;
}

function getPlayers() {
    return game.users.filter((user) => {
        return (user.role == CONST.USER_ROLES.PLAYER || user.role == CONST.USER_ROLES.TRUSTED);
    });
}

/**
 *
 * @param {Array<object>} items
 * @param {number} chanceOfDamagedItems
 * @param {number} damagedItemsMultiplier
 * @param {number} removeDamagedItems
 *
 * @returns {Array<Items>} items Filtered lootable items
 */
function _getLootableItems(
    items
) {
    return items
        /** .map((item) => {
                return item.toObject();
            })*/
        .filter((item) => {
            if (item.type == 'weapon') {
                return item.data.weaponType != 'natural';
            }

            if (item.type == 'equipment') {
                if (!item.data.armor) return true;
                return item.data.armor.type != 'natural';
            }

            return !['class', 'spell', 'feat'].includes(item.type);
        })
        .map((item) => {
            item.data.equipped = false;
            return item;
        });
}