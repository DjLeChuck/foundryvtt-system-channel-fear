import BaseItemSheet from './base-item-sheet.mjs';

export default class WeaponItemSheet extends BaseItemSheet {
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    position: {
      height: 340,
    },
    item: {
      type: 'weapon',
    },
  };

  static {
    this._initializeItemSheetClass();
  }
}
