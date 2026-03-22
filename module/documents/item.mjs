import * as Dice from '../dice.mjs';

export default class ChannelFearItem extends foundry.documents.Item {
  async roll() {
    if ('specialty' === this.type) {
      return await Dice.specialtyCheck(this);
    }

    if ('weapon' === this.type) {
      return await Dice.weaponCheck(this);
    }
  }
}
