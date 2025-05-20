import BaseActorSheet from './base-actor-sheet.mjs';

export default class NpcActorSheet extends BaseActorSheet {
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    actor: {
      type: 'npc',
    },
  };

  static PARTS = foundry.utils.deepClone(super.PARTS);
  static TABS = foundry.utils.deepClone(super.TABS);

  static {
    this._initializeActorSheetClass();

    this.TABS.sheet[1].label = 'CF.CharacterSheet.Tabs.AbilitiesWeapons';
    this.TABS.sheet[2].label = 'CF.CharacterSheet.Biography';
  }
}
