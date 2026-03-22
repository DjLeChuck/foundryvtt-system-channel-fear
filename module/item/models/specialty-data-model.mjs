export default class SpecialtyDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      ability: new fields.StringField({
        required: true,
        label: 'CF.Global.Ability',
        initial: 'act',
        choices: {
          'act': 'CF.Abilities.Act',
          'kno': 'CF.Abilities.Kno',
          'bea': 'CF.Abilities.Bea',
          'for': 'CF.Abilities.For',
          'per': 'CF.Abilities.Per',
          'imp': 'CF.Abilities.Imp',
          'knh': 'CF.Abilities.Knh',
          'fig': 'CF.Abilities.Fig',
          'sel': 'CF.Abilities.Sel',
          'aim': 'CF.Abilities.Aim',
        },
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
