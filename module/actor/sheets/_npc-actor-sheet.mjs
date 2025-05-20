export class NpcActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CONFIG.CF.SYSTEM_ID, 'sheet', 'actor', 'npc-sheet'],
      template: `systems/${CONFIG.CF.SYSTEM_ID}/templates/actor/actor-npc-sheet.html.hbs`,
      width: 700,
      height: 500,
    });
  }

  /**
   * @type {NpcActor}
   */
  get actor() {
    return this.object;
  }

  /** @override */
  async getData() {
    const context = super.getData();

    // context.enrichedDescription = await TextEditor.enrichHTML(context.actor.system.description, { async: true });

    return context;
  }
}
