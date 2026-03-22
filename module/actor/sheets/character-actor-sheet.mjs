import BaseActorSheet from './base-actor-sheet.mjs';

const { ux } = foundry.applications;

export default class CharacterActorSheet extends BaseActorSheet {
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    classes: ['character'],
    actor: {
      type: 'character',
    },
  };

  static PARTS = {
    ...super.PARTS,
    specialties: {
      template: 'systems/channel-fear/templates/actor/parts/actor-specialties.hbs',
    },
    notes: {
      template: 'systems/channel-fear/templates/actor/parts/actor-notes.hbs',
    },
  };
  static TABS = foundry.utils.deepClone(super.TABS);

  static {
    this._initializeActorSheetClass();

    this.PARTS.informations.templates.push('systems/channel-fear/templates/actor/parts/actor-resources.hbs');
    this.PARTS.bio.templates = ['systems/channel-fear/templates/actor/parts/actor-evolution.hbs'];

    this.TABS.sheet[1].label = 'CF.CharacterSheet.Tabs.AbilitiesSpecialtiesWeapons';
    this.TABS.sheet[2].label = 'CF.CharacterSheet.Tabs.BiographyEvolution';
    this.TABS.sheet.push({ id: 'notes', group: 'sheet', label: 'CF.CharacterSheet.Notes' });
  }

  async _preparePartContext(partId, context) {
    context = await super._preparePartContext(partId, context);

    if ('notes' === partId) {
      context.enrichedNotes = await ux.TextEditor.implementation.enrichHTML(this.actor.system.notes, {
        secrets: this.document.isOwner,
        relativeTo: this.actor,
      });
    }

    return context;
  }
}
