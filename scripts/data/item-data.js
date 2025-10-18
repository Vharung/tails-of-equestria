import {TYPE} from "./constantes.js";
export default class PonyItemData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      name: new fields.StringField({ required: true, initial: "Nouvel objet" }),
      type:new fields.StringField({
        required: true,
        initial: TYPE.objet,
        choices: {
          [TYPE.objet]:"Objet",
          [TYPE.magie]:"Magie"
        }
      }),
      quantity: new fields.NumberField({ required: true, initial: 1, integer: true, min: 1 }),
      description: new fields.HTMLField({ required: false, blank: true, initial: "", textSearch: true }),
    }
  }
}