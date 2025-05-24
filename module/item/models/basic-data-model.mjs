export default class BasicDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField({
        label: 'CF.Global.Description',
      }),
    };
  }
}
