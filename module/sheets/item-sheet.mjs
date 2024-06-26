export class ChannelFearItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['channelfear', 'sheet', 'item'],
      submitOnChange: false,
      width: 480,
      height: 204,
    });
  }

  get template() {
    return `systems/channel-fear/templates/item/item-${this.item.type}-sheet.hbs`;
  }

  getData(options) {
    const context = super.getData(options);
    const itemData = this.item.toObject(false);

    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    context.system = itemData.system;
    context.flags = itemData.flags;

    if ('specialty' === itemData.type) {
      this._prepareAbilitiesData(context);
    }

    if ('weapon' === itemData.type) {
      this._prepareWeaponsData(context);
    }

    return context;
  }

  _prepareAbilitiesData(context) {
    context.abilitiesList = CONFIG.CF.abilities;
    context.rerollOptions = {
      1: 1,
      2: 2,
      3: 3,
    };
  }

  _prepareWeaponsData(context) {
    context.abilitiesList = CONFIG.CF.weaponsAbilities;
    context.weaponsCategories = CONFIG.CF.weaponsCategories;
    context.rerollOptions = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
    };
  }
}
