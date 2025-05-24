export default class ChannelFearActor extends foundry.documents.Actor {
  getRollData() {
    const data = foundry.utils.deepClone(super.getRollData());

    this._getCharacterRollData(data);

    return data;
  }

  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

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
}
