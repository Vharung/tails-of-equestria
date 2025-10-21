import {RACE, DES} from "./constantes.js";
export default class PonyCharacterData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      /** 🔹 Informations générales */
      name: new fields.StringField({ required: true, initial: game.i18n.localize("Pony.Character.Data.New") }),
      marque: new fields.StringField({ required: true, initial: "icons/svg/mystery-man.svg" }),
      harmony: new fields.StringField({ required: true, initial: "" }),
      race: new fields.StringField({
        required: true,
        initial: RACE.poney,
        choices: {
          [RACE.bison]:game.i18n.localize("Pony.Character.Data.Race.Bison"),
          [RACE.changelin]:game.i18n.localize("Pony.Character.Data.Race.Changelin"),
          [RACE.chat]:game.i18n.localize("Pony.Character.Data.Race.Chat"),
          [RACE.chien]:game.i18n.localize("Pony.Character.Data.Race.Chien"),
          [RACE.chat]:game.i18n.localize("Pony.Character.Data.Race.Cristal"),
          [RACE.dragon]:game.i18n.localize("Pony.Character.Data.Race.Dragon"),
          [RACE.griffon]:game.i18n.localize("Pony.Character.Data.Race.Griffon"),
          [RACE.hypogriffe]:game.i18n.localize("Pony.Character.Data.Race.Hippogriffe"),
          [RACE.kirin]:game.i18n.localize("Pony.Character.Data.Race.Kirin"),
          [RACE.livre]:game.i18n.localize("Pony.Character.Data.Race.Livre"),
          [RACE.livre]:game.i18n.localize("Pony.Character.Data.Race.Papillon"),
          [RACE.pegase]:game.i18n.localize("Pony.Character.Data.Race.Pegasse"),          
          [RACE.poney]:game.i18n.localize("Pony.Character.Data.Race.Poney"),
          [RACE.licorne]:game.i18n.localize("Pony.Character.Data.Race.Licorne"),
          [RACE.reptilien]:game.i18n.localize("Pony.Character.Data.Race.Reptilien"),
          [RACE.yack]:game.i18n.localize("Pony.Character.Data.Race.Yack"),
          [RACE.zebre]:game.i18n.localize("Pony.Character.Data.Race.Zebre")
        }
      }),
      biography: new fields.HTMLField({ required: false, blank: true, initial: "", textSearch: true }),
      level: new fields.NumberField({ required: true, initial: 1, min: 1}),
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
}