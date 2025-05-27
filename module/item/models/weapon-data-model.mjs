import { CF } from '../../helpers/config.mjs';

export default class WeaponDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      ability: new fields.StringField({
        required: true,
        label: 'CF.Global.Ability',
        initial: 'fig',
        choices: {
          'fig': 'CF.Abilities.Fig',
          'aim': 'CF.Abilities.Aim',
        },
      }),
      category: new fields.NumberField({
        required: true,
        label: 'CF.Global.Category',
        initial: 1,
        choices: {
          1: 'CF.Weapons.Categories.BareHands',
          2: 'CF.Weapons.Categories.VeryLight',
          3: 'CF.Weapons.Categories.Light',
          4: 'CF.Weapons.Categories.Medium',
          5: 'CF.Weapons.Categories.Heavy',
        },
      }),
      reroll: new fields.NumberField({
        required: true,
        label: 'CF.Global.Rerolls',
        hint: 'CF.Weapons.RerollHint',
        integer: true,
        initial: 0,
        min: 0,
        max: CF.weaponMaxReroll,
      }),
      allMightHitReroll: new fields.NumberField({
        integer: true,
        max: CF.weaponMaxReroll,
      }),
    };
  }

  prepareDerivedData() {
    // Add force reroll
    if ('fig' === this.ability) {
      this.allMightHitReroll = this.reroll;

      if (this.parent.actor?.system) {
        this.allMightHitReroll += (CONFIG.CF.allMightHitReroll[this.parent.actor.system.abilities.for] || 0);
      }

      this.allMightHitReroll = Math.min(this.allMightHitReroll, CONFIG.CF.weaponMaxReroll);
    }

    // Ensure weapons lower than category 4 cannot have more than 1 reroll
    if (4 > this.category) {
      this.reroll = Math.min(this.reroll, 1);
    }
  }
}
