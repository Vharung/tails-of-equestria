//import les différentes classes
import PonyCharacterSheet from "./sheet/actor-sheet.js";
import PonyMonsterSheet from "./sheet/monster-sheet.js";
import PonyItemSheet from "./sheet/item-sheet.js";
import PonyTalentSheet from "./sheet/talent-sheet.js";
import PonyQuicksSheet from "./sheet/quicks-sheet.js";

import PonyCharacterData from "./data/actor-data.js";
import PonyPnjData from "./data/npc-data.js";
import PonyItemData from "./data/item-data.js";


const ActorSheetV2 = foundry.applications.sheets.ActorSheetV2;
const ItemSheetV2 = foundry.applications.sheets.ItemSheetV2;

/** Initialisation du système */
Hooks.once("init", async function () {
  console.log("Initialisation du système Tail of Equestria...");

  // Définition des modèles de données
  CONFIG.Actor.dataModels = {
    character: PonyCharacterData,
    pnj: PonyPnjData,
    monstre: PonyPnjData // si tu n’as pas encore un modèle spécifique
  };

  CONFIG.Item.dataModels = {
    item: PonyItemData,
    talent: PonyItemData,
    faiblesse: PonyItemData
  };

  // Initiative
  CONFIG.Combat.initiative = {
    formula: "1d6",
    decimals: 1
  };

  // Acteurs 
  foundry.documents.collections.Actors.unregisterSheet("core", ActorSheetV2); 
  foundry.documents.collections.Actors.registerSheet("pony", PonyCharacterSheet, { types: ["character","pnj"], makeDefault: true }); 
  foundry.documents.collections.Actors.registerSheet("pony", PonyMonsterSheet, { types: ["monstre"], makeDefault: true }); 

  // Items 
  foundry.documents.collections.Items.unregisterSheet("core", ItemSheetV2); 
  foundry.documents.collections.Items.registerSheet("pony", PonyItemSheet, { types: ["item"], makeDefault: true }); 
  foundry.documents.collections.Items.registerSheet("pony", PonyTalentSheet, { types: ["talent"], makeDefault: true }); 
  foundry.documents.collections.Items.registerSheet("pony", PonyQuicksSheet, { types: ["faiblesse"], makeDefault: true }); 

  console.log("✅ Système Tail of Equestria initialisé !");
});

Handlebars.registerHelper("stripTags", function (text) {
  return text.replace(/<\/?[^>]+(>|$)/g, "");
});
