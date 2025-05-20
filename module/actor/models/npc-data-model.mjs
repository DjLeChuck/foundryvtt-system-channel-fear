import BaseDataModel from './base-data-model.mjs';

export default class NpcDataModel extends BaseDataModel {
  static defineSchema() {
    const baseData = super.defineSchema();

    const fields = foundry.data.fields;

    return {
      ...baseData,
      attributes: new fields.SchemaField({
        health: new fields.NumberField({ required: true, min: 0, max: 6 }),
      }),
      level: new fields.StringField({
        required: true,
        choices: ['weak', 'medium', 'strong', 'unbeatable'],
        initial: 'weak',
      }),
    };
  }

  prepareDerivedData() {
    super.prepareDerivedData();

    // @todo À revoir
    // if (this.system.abilities) {
    //   const abilitiesPoints = CONFIG.CF.npcAbilitiesPoints[this.system.level];
    //
    //   for (const k of Object.keys(this.system.abilities)) {
    //     this.system.abilities[k] = abilitiesPoints;
    //   }
    // }
  }
}
