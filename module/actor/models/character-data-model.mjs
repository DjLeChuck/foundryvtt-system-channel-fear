import BaseDataModel from './base-data-model.mjs';
import { CF } from '../../helpers/config.mjs';

export default class CharacterDataModel extends BaseDataModel {
  static defineSchema() {
    const baseData = super.defineSchema();

    const fields = foundry.data.fields;

    return {
      ...baseData,
      notes: new fields.HTMLField(),
      info: new fields.SchemaField({
        profile: new fields.StringField({
          label: 'CF.CharacterSheet.Profile',
        }),
        profdef: new fields.StringField({
          label: 'CF.CharacterSheet.ProfDef',
        }),
      }),
      attributes: new fields.SchemaField({
        health: new fields.NumberField({
          required: true,
          label: 'CF.CharacterSheet.Health.Title',
          integer: true,
          min: 0,
          max: CF.maxHealth,
          step: 1,
          initial: CF.maxHealth,
        }),
        resource: new fields.NumberField({
          required: true,
          label: 'CF.CharacterSheet.Resource.Title',
          integer: true,
          min: 0,
          max: CF.maxResource,
          initial: CF.maxResource,
        }),
        evolution: new fields.NumberField({
          required: true,
          label: 'CF.CharacterSheet.Evolution.Title',
          integer: true,
          min: 0,
          initial: 0,
        }),
      }),
    };
  }
}
