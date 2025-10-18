export default class PonyMonstreData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
       name: new fields.StringField({ required: true, initial: "Nouveau Item" })
    }
  }
}