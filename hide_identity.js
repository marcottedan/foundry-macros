let d = new Dialog({
    title: 'Reveal NPC',
    content: `Sure? This will reveal selected NPCs names.`,
    buttons: {
        no: {
            icon: '<i class="fas fa-ban"></i>',
            label: 'Cancel',
        },
        yes: {
            icon: '<i class="fas fa-thumbs-up"></i>',
            label: 'Convert',
            callback: (html) => {
                RevealIdentity();
            },
        },
    },
    default: 'no',
}).render(true);

// Reveal controlled tokens (except players) names on the map so that the name shows for everyone.
async function RevealIdentity() {

    // Display Modes: ALWAYS, CONTROL, HOVER, NONE, OWNER, OWNER_HOVER
    const tokens = canvas.tokens.controlled
        .filter(token => token.actor.data.type !== 'character')
        .map(token => {
            return {
                _id: token.id,
                "displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER
            };
        });

    await canvas.scene.updateEmbeddedDocuments('Token', tokens)

}