const { api, sheets, ux } = foundry.applications;

export default class BaseItemSheet extends api.HandlebarsApplicationMixin(sheets.ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ['channel-fear', 'item'],
    position: {
      height: 500,
    },
    item: {
      type: undefined, // Defined by subclass
    },
    form: {
      submitOnChange: true,
    },
  };

  static PARTS = {
    header: {
      template: 'systems/channel-fear/templates/item/parts/simple-header.hbs',
    },
    body: {
      template: undefined,
    },
  };

  /**
   * A method which subclasses can call in a static initialization block to refine configuration options at the
   * class level.
   */
  static _initializeItemSheetClass() {
    const item = this.DEFAULT_OPTIONS.item;

    this.PARTS = foundry.utils.deepClone(this.PARTS);
    this.PARTS.body.template = `systems/channel-fear/templates/item/item-${item.type}-body.hbs`;

    this.DEFAULT_OPTIONS.classes = [item.type];
  }

  /** @override */
  async _prepareContext() {
    return {
      item: this.document,
      system: this.document.system,
      fields: this.document.schema.fields,
      systemFields: this.document.system.schema.fields,
      source: this.document.toObject(),
      editable: this.isEditable,
    };
  }
}
