import { CF } from '../../helpers/config.mjs';

export default class SpecialtyDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      ability: new fields.StringField({
        required: true,
        label: 'CF.Global.Ability',
        initial: 'act',
        choices: CF.abilities,
      }),
      reroll: new fields.NumberField({
        required: true,
        label: 'CF.Global.Rerolls',
        integer: true,
        initial: 1,
        min: 1,
        max: 3,
      }),
    };
  }
}
