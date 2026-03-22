import BaseItemSheet from './base-item-sheet.mjs';

export default class SpecialtyItemSheet extends BaseItemSheet {
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    position: {
      height: 220,
    },
    item: {
      type: 'specialty',
    },
  };

  static {
    this._initializeItemSheetClass();
  }
}
