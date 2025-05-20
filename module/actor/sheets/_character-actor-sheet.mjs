export class CharacterActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CONFIG.CF.SYSTEM_ID, 'sheet', 'actor', 'character-sheet'],
      template: `systems/${CONFIG.CF.SYSTEM_ID}/templates/actor/actor-character-sheet.hbs`,
      width: 700,
      height: 500,
    });
  }

  /**
   * @type {CharacterActor}
   */
  get actor() {
    return this.object;
  }

  /** @override */
  async getData() {
    const context = super.getData();

    // context.enrichedDescription = await TextEditor.enrichHTML(context.actor.system.description, { async: true });

    // const actorData = this.actor.toObject(false);

    // context.system = actorData.system;
    // context.flags = actorData.flags;
    context.isNpc = false;
    context.abilitiesList = CONFIG.CF.abilities;
    context.rollData = this.actor.getRollData();

    // this._prepareItems(context);

    return context;
  }
}
