export default class BaseDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const abilityOptions = { required: true, min: 0, max: 6, initial: 1 };

    return {
      keywords: new fields.StringField(),
      biography: new fields.HTMLField(),
      abilities: new fields.SchemaField({
        act: new fields.NumberField(abilityOptions),
        kno: new fields.NumberField(abilityOptions),
        bea: new fields.NumberField(abilityOptions),
        for: new fields.NumberField(abilityOptions),
        per: new fields.NumberField(abilityOptions),
        imp: new fields.NumberField(abilityOptions),
        knh: new fields.NumberField(abilityOptions),
        fig: new fields.NumberField(abilityOptions),
        sel: new fields.NumberField(abilityOptions),
        aim: new fields.NumberField(abilityOptions),
      }),
    };
  }
}
