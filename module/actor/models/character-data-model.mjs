import BaseDataModel from './base-data-model.mjs';

export default class CharacterDataModel extends BaseDataModel {
  static defineSchema() {
    const baseData = super.defineSchema();

    const fields = foundry.data.fields;

    return {
      ...baseData,
      notes: new fields.HTMLField(),
      info: new fields.SchemaField({
        profile: new fields.StringField(),
        profdef: new fields.StringField(),
      }),
      attributes: new fields.SchemaField({
        health: new fields.NumberField({ required: true, integer: true, min: 0, max: 6, initial: 6 }),
        resource: new fields.NumberField({ required: true, integer: true, min: 0, max: 6, initial: 6 }),
        evolution: new fields.NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      }),
    };
  }
}
