import * as Dice from '../dice.mjs';

export default class ChannelFearItem extends foundry.documents.Item {
  prepareDerivedData() {
    this.#prepareWeaponData();
  }

  async roll() {
    if ('specialty' === this.type) {
      return await Dice.specialtyCheck(this);
    }

    if ('weapon' === this.type) {
      return await Dice.weaponCheck(this);
    }
  }

  #prepareWeaponData() {
    if ('weapon' !== this.type) {
      return;
    }

    // Add force reroll
    if ('fig' === this.system.ability) {
      this.system.allMightHitReroll = this.system.reroll;

      if (this.actor?.system) {
        this.system.allMightHitReroll += (CONFIG.CF.allMightHitReroll[this.actor.system.abilities.for] || 0);
      }

      this.system.allMightHitReroll = Math.min(this.system.allMightHitReroll, CONFIG.CF.weaponMaxReroll);
    }

    // Ensure weapons lower than category 4 cannot have more than 1 reroll
    if (4 > this.system.category) {
      this.system.reroll = Math.min(this.system.reroll, 1);
    }
  }
}
