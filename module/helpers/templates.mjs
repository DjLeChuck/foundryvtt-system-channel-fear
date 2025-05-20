export const preloadHandlebarsTemplates = function () {
  foundry.applications.handlebars.loadTemplates([
    // Actor partials
    // `systems/${CONFIG.CF.SYSTEM_ID}/templates/actor/parts/actor-abilities.hbs`,
    // `systems/${CONFIG.CF.SYSTEM_ID}/templates/actor/parts/actor-character-bio.hbs`,
    // `systems/${CONFIG.CF.SYSTEM_ID}/templates/actor/parts/actor-npc-bio.hbs`,
    // `systems/${CONFIG.CF.SYSTEM_ID}/templates/actor/parts/actor-evolution.hbs`,
    // `systems/${CONFIG.CF.SYSTEM_ID}/templates/actor/parts/actor-informations.hbs`,
    // `systems/${CONFIG.CF.SYSTEM_ID}/templates/actor/parts/actor-informations-right-part.hbs`,
    // `systems/${CONFIG.CF.SYSTEM_ID}/templates/actor/parts/actor-notes.hbs`,
    // `systems/${CONFIG.CF.SYSTEM_ID}/templates/actor/parts/actor-resources.hbs`,
    // `systems/${CONFIG.CF.SYSTEM_ID}/templates/actor/parts/actor-specialties.hbs`,
    // `systems/${CONFIG.CF.SYSTEM_ID}/templates/actor/parts/actor-weapons-items.hbs`,
    // Rolls partials
    // `systems/${CONFIG.CF.SYSTEM_ID}/templates/partials/roll/roll-card.hbs`,
    // `systems/${CONFIG.CF.SYSTEM_ID}/templates/partials/roll/roll-dialog.hbs`,
    // Item partials
    // `systems/${CONFIG.CF.SYSTEM_ID}/templates/item/parts/simple-header.hbs`,
  ]);
};
