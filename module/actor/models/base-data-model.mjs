import { CF } from '../../helpers/config.mjs';

export default class BaseDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const abilityOptions = {
      required: true,
      integer: true,
      min: 0,
      max: CF.maxAbility,
      initial: 1,
    };

    return {
      keywords: new fields.StringField({
        label: 'CF.CharacterSheet.Keywords',
      }),
      biography: new fields.HTMLField(),
      abilities: new fields.SchemaField({
        act: new fields.NumberField({
          ...abilityOptions,
          label: 'CF.Abilities.Act',
        }),
        kno: new fields.NumberField({
          ...abilityOptions,
          label: 'CF.Abilities.Kno',
        }),
        bea: new fields.NumberField({
          ...abilityOptions,
          label: 'CF.Abilities.Bea',
        }),
        for: new fields.NumberField({
          ...abilityOptions,
          label: 'CF.Abilities.For',
        }),
        per: new fields.NumberField({
          ...abilityOptions,
          label: 'CF.Abilities.Per',
        }),
        imp: new fields.NumberField({
          ...abilityOptions,
          label: 'CF.Abilities.Imp',
        }),
        knh: new fields.NumberField({
          ...abilityOptions,
          label: 'CF.Abilities.Knh',
        }),
        fig: new fields.NumberField({
          ...abilityOptions,
          label: 'CF.Abilities.Fig',
        }),
        sel: new fields.NumberField({
          ...abilityOptions,
          label: 'CF.Abilities.Sel',
        }),
        aim: new fields.NumberField({
          ...abilityOptions,
          label: 'CF.Abilities.Aim',
        }),
      }),
    };
  }
}
