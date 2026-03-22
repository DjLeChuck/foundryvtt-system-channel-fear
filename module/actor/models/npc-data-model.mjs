import BaseDataModel from './base-data-model.mjs';
import { CF } from '../../helpers/config.mjs';

export default class NpcDataModel extends BaseDataModel {
  static defineSchema() {
    const baseData = super.defineSchema();

    const fields = foundry.data.fields;

    return {
      ...baseData,
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
      }),
      level: new fields.StringField({
        required: true,
        label: 'CF.NpcSheet.Level.Label',
        choices: {
          'weak': 'CF.NpcSheet.Level.Values.weak',
          'medium': 'CF.NpcSheet.Level.Values.medium',
          'strong': 'CF.NpcSheet.Level.Values.strong',
          'unbeatable': 'CF.NpcSheet.Level.Values.unbeatable',
        },
        initial: 'weak',
      }),
    };
  }

  prepareDerivedData() {
    super.prepareDerivedData();

    const abilitiesPoints = CF.npcAbilitiesPoints[this.level];

    for (const k of Object.keys(this.abilities)) {
      this.abilities[k] = abilitiesPoints;
    }
  }
}
