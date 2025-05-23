import BaseItemSheet from './base-item-sheet.mjs';

const { ux } = foundry.applications;

export default class BasicItemSheet extends BaseItemSheet {
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    item: {
      type: 'basic',
    },
  };

  static {
    this._initializeItemSheetClass();
  }

  async _preparePartContext(partId, context) {
    context = await super._preparePartContext(partId, context);

    if ('body' === partId) {
      context.enrichedDescription = await ux.TextEditor.enrichHTML(this.item.system.description, {
        secrets: this.document.isOwner,
        relativeTo: this.item,
      });
    }

    return context;
  }
}
