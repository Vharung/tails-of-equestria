import {DES,TYPE} from "./constantes.js";
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
          [TYPE.talent]:"Talent",
          [TYPE.defaut]:"Défaut"
        }
      }),
      quantity: new fields.NumberField({ required: true, initial: 1, integer: true, min: 1 }),
      restriction: new fields.StringField({ required: true, initial: "aucune" }),
      dice: new fields.StringField({ 
        required: true,
        initial: DES.d6,
        choices: {
          [DES.d4]:"d4",
          [DES.d6]:"d6",
          [DES.d8]:"d8",
          [DES.d10]:"d10",
          [DES.d12]:"d12"
        }
      }),
      description: new fields.HTMLField({ required: false, blank: true, initial: "", textSearch: true }),
    }
  }
}