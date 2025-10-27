import {RACE, DES, HARMONY} from "./constantes.js";
export default class PonyPNJData extends foundry.abstract.DataModel {
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
          [RACE.bison]:game.i18n.localize("Pony.Character.Data.Race.Bison"),
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
          [RACE.papillon]:game.i18n.localize("Pony.Character.Data.Race.Papillon"),
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
          [DES.d0]:"-",
          [DES.d1]:"1",
          [DES.d4]:"d4",
          [DES.d6]:"d6",
          [DES.d8]:"d8",
          [DES.d10]:"d10",
          [DES.d12]:"d12",
          [DES.d20]:"d20",
          [DES.d26]:"d20+d6",
          [DES.d30]:"d20+d10",
          [DES.d32]:"d20+d12",
          [DES.d40]:"2d20",
          [DES.d60]:"3d20",
          [DES.d80]:"4d20",
          [DES.d100]:"5d20"
        }
      }),
      mind: new fields.StringField({ 
        required: true,
        initial: DES.d6,
        choices: {
          [DES.d0]:"-",
          [DES.d1]:"1",
          [DES.d4]:"d4",
          [DES.d6]:"d6",
          [DES.d8]:"d8",
          [DES.d10]:"d10",
          [DES.d12]:"d12",
          [DES.d20]:"d20",
          [DES.d26]:"d20+d6",
          [DES.d30]:"d20+d10",
          [DES.d32]:"d20+d12",
          [DES.d40]:"2d20",
          [DES.d60]:"3d20",
          [DES.d80]:"4d20",
          [DES.d100]:"5d20"
        }
      }),
      charm: new fields.StringField({ 
        required: true,
        initial: DES.d6,
        choices: {
          [DES.d0]:"-",
          [DES.d1]:"1",
          [DES.d4]:"d4",
          [DES.d6]:"d6",
          [DES.d8]:"d8",
          [DES.d10]:"d10",
          [DES.d12]:"d12",
          [DES.d20]:"d20",
          [DES.d26]:"d20+d6",
          [DES.d30]:"d20+d10",
          [DES.d32]:"d20+d12",
          [DES.d40]:"2d20",
          [DES.d60]:"3d20",
          [DES.d80]:"4d20",
          [DES.d100]:"5d20"
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