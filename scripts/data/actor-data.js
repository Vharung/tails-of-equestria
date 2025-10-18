import {RACE, DES} from "./constantes.js";
export default class PonyCharacterData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      /** 🔹 Informations générales */
      name: new fields.StringField({ required: true, initial: "Nouveau personnage" }),
      race: new fields.StringField({
        required: true,
        initial: RACE.poney,
        choices: {
          [RACE.poney]:"poney",
          [RACE.licorne]:"licorne",
          [RACE.pegase]:"pegase",
          [RACE.griffon]:"griffon",
          [RACE.dragon]:"dragon",
          [RACE.hypogryffe]:"hypogriffe",
          [RACE.changelin]:"changelin",
          [RACE.yack]:"yack"
        }
      }),
      biography: new fields.HTMLField({ required: false, blank: true, initial: "", textSearch: true }),
      level: new fields.NumberField({ required: true, initial: 1, integer: true, min: 1, max: 10 }),
      cutieMark: new fields.StringField({ initial: "" }),
      talent: new fields.StringField({ initial: "" }),
      flaw: new fields.StringField({ initial: "" }),

      /** 🔹 Caractéristiques principales */
      body: new fields.StringField({ 
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
      mind: new fields.StringField({ 
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
      charm: new fields.StringField({ 
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

      /** 🔹 Points de vie / robustesse */
      robustness: new fields.SchemaField({
        max: new fields.NumberField({ required: true, initial: 10, integer: true }),
        current: new fields.NumberField({ required: true, initial: 10, integer: true })
      }),

      /** 🔹 Points d’amitié */
      friendship: new fields.SchemaField({
        max: new fields.NumberField({ required: true, initial: 4, integer: true }),
        current: new fields.NumberField({ required: true, initial: 4, integer: true })
      }),

      /** 🔹 Inventaire et talents */
      inventory: new fields.ArrayField(new fields.ObjectField()),
      talents: new fields.ArrayField(new fields.ObjectField()),

      /** 🔹 Notes / historique */
      notes: new fields.HTMLField({ initial: "" })
    };
  }

  /** Ajuste les PV max selon la race */
  prepareBaseData() {
    const race = this.race?.toLowerCase() ?? "poney terrestre";

    switch (race) {
      case "poney terrestre":
        this.robustness.max = 12;
        break;
      case "licorne":
        this.robustness.max = 10;
        break;
      case "pégase":
        this.robustness.max = 10;
        break;
      case "griffon":
        this.robustness.max = 11;
        break;
      case "dragon":
        this.robustness.max = 14;
        break;
      case "hypogriffe":
        this.robustness.max = 11;
        break;
      case "changelin":
        this.robustness.max = 9;
        break;
      case "yack":
        this.robustness.max = 13;
        break;
      default:
        this.robustness.max = 10;
    }

    // S’assurer que les PV actuels ne dépassent pas le max
    if (this.robustness.current > this.robustness.max)
      this.robustness.current = this.robustness.max;
  }
}
