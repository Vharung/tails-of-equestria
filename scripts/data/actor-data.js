import {RACE, DES, HARMONY, COULEUR} from "./constantes.js";
export default class PonyCharacterData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      /** 🔹 Informations générales */
      name: new fields.StringField({ required: true, initial: game.i18n.localize("Pony.Character.Data.New") }),
      marque: new fields.StringField({ required: true, initial: "systems/tails-of-equestria/assets/logo-pony.webp" }),
      harmony: new fields.StringField({
        required: true,
        initial: HARMONY.aucun,
        choices: {
          [HARMONY.aucun]:game.i18n.localize("Pony.Character.Data.Harmony.Aucun"),
          [HARMONY.magie]:game.i18n.localize("Pony.Character.Data.Harmony.Magie"),
          [HARMONY.rire]:game.i18n.localize("Pony.Character.Data.Harmony.Rire"),
          [HARMONY.honnetete]:game.i18n.localize("Pony.Character.Data.Harmony.Honnetete"),
          [HARMONY.loyaute]:game.i18n.localize("Pony.Character.Data.Harmony.Loyaute"),
          [HARMONY.generosite]:game.i18n.localize("Pony.Character.Data.Harmony.Generosite"),
          [HARMONY.bonte]:game.i18n.localize("Pony.Character.Data.Harmony.Bonte")
        }
      }),
      race: new fields.StringField({
        required: true,
        initial: RACE.poney,
        choices: {
          [RACE.alicorne]:game.i18n.localize("Pony.Character.Data.Race.Alicorne"),
          [RACE.changelin]:game.i18n.localize("Pony.Character.Data.Race.Changelin"),
          [RACE.caribou]:game.i18n.localize("Pony.Character.Data.Race.Caribou"),
          [RACE.cerf]:game.i18n.localize("Pony.Character.Data.Race.Cerf"),
          [RACE.chat]:game.i18n.localize("Pony.Character.Data.Race.Chat"),
          [RACE.cheval]:game.i18n.localize("Pony.Character.Data.Race.Cheval"),
          [RACE.chien]:game.i18n.localize("Pony.Character.Data.Race.Chien"),
          [RACE.cristal]:game.i18n.localize("Pony.Character.Data.Race.Cristal"),
          [RACE.dragon]:game.i18n.localize("Pony.Character.Data.Race.Dragon"),
          [RACE.griffon]:game.i18n.localize("Pony.Character.Data.Race.Griffon"),
          [RACE.hypogriffe]:game.i18n.localize("Pony.Character.Data.Race.Hippogriffe"),
          [RACE.kirin]:game.i18n.localize("Pony.Character.Data.Race.Kirin"),
          [RACE.longma]:game.i18n.localize("Pony.Character.Data.Race.Longma"),
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
      argent: new fields.NumberField({ required: true, initial: 100, min: 0}),
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
          [DES.d12]:"d12",
          [DES.d20]:"d20"
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
          [DES.d12]:"d12",
          [DES.d20]:"d20"
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
          [DES.d12]:"d12",
          [DES.d20]:"d20"
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
      notes: new fields.HTMLField({ initial: "" }),
      couleur: new fields.SchemaField({
        corps1: new fields.StringField({ required: true, initial: "#D3A1CA"}),
        corps2: new fields.StringField({ required: true, initial: "#FFECDB" }),
        yeux: new fields.StringField({ required: true, initial: "#129A78" }),
        corne: new fields.StringField({ required: true, initial: "#AD2225" }),
        ailes: new fields.StringField({ required: true, initial: "#D3A1CA" }),
        criniere: new fields.StringField({ required: true, initial: "#C05FA5" }),
        queue: new fields.StringField({ required: true, initial: "#C05FA5" })
      }),
     coupe: new fields.StringField({ 
      required: true,
      initial: "aucune",
      choices: {
        "aucune":"aucune",
        "coupe1": "Coupe 1",
        "coupe2": "Coupe 2",
        "coupe3": "Coupe 3",
        "coupe4": "Coupe 4",
        "coupe5": "Coupe 5",
        "coupe6": "Coupe 6",
        "coupe7": "Coupe 7",
        "coupe8": "Coupe 8",
        "coupe9": "Coupe 9",
        "coupe10": "Coupe 10",
        "coupe11": "Coupe 11",
        "coupe12": "Coupe 12",
        "coupe13": "Coupe 13",
        "coupe14": "Coupe 14",
        "coupe15": "Coupe Changelin",
        "coupe16": "Casque Caribou"
      }
    }),
    queue: new fields.StringField({ 
      required: true,
      initial: "aucune",
      choices: {
        "aucune":"aucune",
        "coupe1": "Queue 1",
        "coupe2": "Queue 2",
        "coupe3": "Queue 3",
        "coupe4": "Queue 4",
        "coupe5": "Armure Caribou"
      }
    }),
    corne: new fields.StringField({ 
      required: true,
      initial: "aucune",
      choices: {
        "aucune":"aucune",
        "coupe1": "Corne 1",
        "coupe2": "Corne 2",
        "coupe3": "Corne 3",
        "coupe4": "Corne 4"
      }
    }),
    frange: new fields.StringField({ 
      required: true,
      initial: "aucune",
      choices: {
        "aucune":"aucune",
        "coupe1": "Frange 1",
        "coupe2": "Frange 2",
        "coupe3": "Frange 3",
        "coupe4": "Frange 4",
        "coupe5": "Frange 5",
        "coupe6": "Frange 6",
        "coupe7": "Frange 7",
        "coupe8": "Frange 8",
        "coupe9": "Frange 9",
        "coupe12": "Frange 10",
        "coupe13": "Changelin",
        "coupe10": "Crinière 1",
        "coupe11": "Crinière 2"
        
      }
    })

    };
  }
}