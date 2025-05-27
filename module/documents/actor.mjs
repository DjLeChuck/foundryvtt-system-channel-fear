export default class ChannelFearActor extends foundry.documents.Actor {
  async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);

    if (userId !== game.user.id) {
      return;
    }

    await this.#addBareHandsWeapon();
  }

  getRollData() {
    const data = foundry.utils.deepClone(super.getRollData());

    this._getCharacterRollData(data);

    return data;
  }

  _getCharacterRollData(data) {
    if (this.type !== 'character') {
      return;
    }

    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = v;
      }
    }

    if (data.attributes) {
      for (let [k, v] of Object.entries(data.attributes)) {
        data[k] = v;
      }
    }
  }

  async #addBareHandsWeapon() {
    this.createEmbeddedDocuments('Item', [{
      name: game.i18n.localize('CF.Weapons.FistAndCie'),
      type: 'weapon',
      system: {
        ability: 'fig',
        reroll: 0,
        category: 1,
      },
    }]);
  }
}
