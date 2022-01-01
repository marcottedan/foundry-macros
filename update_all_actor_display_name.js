// Changes all actors of the whole game
const updates = game.actors.map(a => ({
    _id: a.id,
    "token.displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER
}));
await Actor.updateDocuments(updates);