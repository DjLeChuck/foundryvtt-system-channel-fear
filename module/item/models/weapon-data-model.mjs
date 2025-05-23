import { CF } from '../../helpers/config.mjs';

export default class WeaponDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      ability: new fields.StringField({
        required: true,
        label: 'CF.Global.Ability',
        initial: 'fig',
        choices: CF.weaponsAbilities,
      }),
      category: new fields.NumberField({
        required: true,
        label: 'CF.Global.Category',
        initial: 1,
        choices: CF.weaponsCategories,
      }),
      reroll: new fields.NumberField({
        required: true,
        label: 'CF.Global.Rerolls',
        integer: true,
        initial: 0,
        min: 0,
        max: CF.weaponMaxReroll,
      }),
    };
  }
}
