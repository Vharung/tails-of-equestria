const ActorSheetV2 = foundry.applications.sheets.ActorSheetV2;
const { HandlebarsApplicationMixin } = foundry.applications.api;
import PonyChat from "../document/chat.js";
import DifficultyDialogV2 from "../document/dialog.js";

/** Gestion de la feuille de personnage */

export default class PonyCharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["tails-of-equestria", "actor", "character"],
    position: { width: 685, height: 890 },
    form: { submitOnChange: true },
    window: {
      resizable: true,
      title: "Fiche de personnage ", // <- titre de la fenêtre
      id: "pony-character-sheet",   // <- identifiant unique
      frame: true,                  // <- force la création d’une fenêtre
      icon: "fa-solid fa-horse",    // <- facultatif
    },
    dragDrop: [{ dragSelector: '[data-drag]', dropSelector: '.list' }], // Remplacer '.inventory-list' par votre sélecteur    tabGroups: { sheet: "inventory" },
    actions: {
      editImage: PonyCharacterSheet.#onEditImage,
      edit: PonyCharacterSheet.#onItemAction,
      use: PonyCharacterSheet.#onItemAction,
      delete: PonyCharacterSheet.#onItemAction,
      roll:PonyCharacterSheet.#onActorAction,
      addItem:PonyCharacterSheet.#onItemAction,
      addMagic:PonyCharacterSheet.#onItemAction,
      addDefaut:PonyCharacterSheet.#onItemAction,
      creer:PonyCharacterSheet.#onCreer
    }
  };

  /** @override */
  static PARTS = {
    header: { template: "systems/tails-of-equestria/templates/actors/character-header.hbs" },
    nav: { template: "systems/tails-of-equestria/templates/actors/character-nav.hbs" },
    biography: { template: "systems/tails-of-equestria/templates/actors/character-biography.hbs" },
    main: { template: "systems/tails-of-equestria/templates/actors/character-main.hbs" }
  };



  /** Préparation des données */
  async _prepareContext() {
    const system = this.document.system;
    const actor = this.document;
    // --- Retour du contexte pour le template
    return {
      tabs: this.#getTabs(),
      fields: this.document.schema.fields,
      systemFields: system.schema.fields,
      actor,
      system,
      source: this.document.toObject(),
      items: this.document.items.toObject(),
    };
  }






  async _preparePartContext(partId, context) {
    return context;
  }

  async _onRender(context, options) {
    super._onRender(context, options);
    //console.log('render')
    console.log(context)

    const system = this.actor.system;
    const el = this.element[0]; // wrapper principal

    /* === 🔹 DRAG & DROP === */
    el.querySelectorAll('[data-drag]').forEach(item => {
      item.addEventListener('dragstart', () => {}); // placeholder
    });

    // === 🔹 ONGLET ACTIF === 
    //conserver le dernier onglet ouvert
    if (!this.actor) return;
    // Récupérer l'onglet actif spécifique à ce personnage (ou valeur par défaut)
    const activeTab = localStorage.getItem(`activeTab-${this.actor.id}`) || "carac"; 
    // Appliquer l'affichage correct
    this._setActiveTab(activeTab);
    // Gérer le clic sur les onglets pour changer de vue
    this.element.querySelectorAll(".sheet-tabs [data-tab]").forEach(tab => {
      tab.addEventListener("click", (event) => {
        const newTab = event.currentTarget.dataset.tab;
        this._setActiveTab(newTab);
      });
      
    });
  }

  static async #onEditImage(event, target) {
    const attr = target.dataset.edit;
    const current = foundry.utils.getProperty(this.document, attr);
    const { img } =
        this.document.constructor.getDefaultArtwork?.(this.document.toObject()) ??
        {};
    const fp = new FilePicker({
        current,
        type: 'image',
        redirectToRoot: img ? [img] : [],
        callback: (path) => {
            this.document.update({ [attr]: path });
        },
        top: this.position.top + 40,
        left: this.position.left + 10,
    });
    return fp.browse();
    }


    static async #onCreer(event) {
      event?.preventDefault();

      const actor = this.actor;
      const system = actor.system;
      // --- 🔹 Tableau des races et leurs caractéristiques
      const raceData = {
        "alicorn": {
          body: "d8", mind: "d12", charm: "d10", robustness: 20,
          talents: ["Vol", "Télékinésie", "Cœur vaillant", "Sorts avancés"],
          quirks: ["Arrogant", "Responsabilité royale"]
        },
        "bison": {
          body: "d12", mind: "d6", charm: "d6", robustness: 18,
          talents: ["Charge", "Peau épaisse", "Talent à choisir"],
          quirks: ["Fier", "Faiblesse à choisir"]
        },
        "changelin": {
          body: "d4", mind: "d4", charm: "d4", robustness: 8,
          talents: ["Métamorphose", "Télékinésie", "Cœur vaillant", "Vol"],
          quirks: ["Affamé d'Amour", "Faiblesse à choisir"]
        },
        "caribou": {
          body: "d8", mind: "d8", charm: "d8", robustness: 12,
          talents: ["Cœur Vaillant", "Résistance magique", "Berserker", "Talent à choisir"],
          quirks: ["Colérique", "Faiblesse à choisir"]
        },
        "cerf": {
          body: "d6", mind: "d6", charm: "d8", robustness: 12,
          talents: ["Sabot Vert", "Furtivité", "Territorial", "Talent à choisir"],
          quirks: ["Protecteur", "Faiblesse à choisir"]
        },
        "chat": {
          body: "d6", mind: "d6", charm: "d6", robustness: 12,
          talents: ["Griffes", "Furtivité", "Talent à choisir"],
          quirks: ["Égoïste", "Faiblesse à choisir"]
        },
        "cheval": {
          body: "d8", mind: "d8", charm: "d6", robustness: 12,
          talents: ["Intellect Sage", "Savant", "Cœur vaillant", "Talent à choisir"],
          quirks: ["Indépendant", "Faiblesse à choisir"]
        },
        "chien": {
          body: "d6", mind: "d6", charm: "d6", robustness: 12,
          talents: ["Fouissage", "Pistage", "Talent à choisir"],
          quirks: ["Avide", "Faiblesse à choisir"]
        },
        "cristal": {
          body: "d6", mind: "d6", charm: "d6", robustness: 12,
          talents: ["Cœur vaillant", "Télékinésie", "Talent à choisir"],
          quirks: ["Cœur de Cristal", "Faiblesse à choisir"]
        },
        "dragon": {
          body: "d8", mind: "d4", charm: "d4", robustness: 12,
          talents: ["Vol", "Souffle Élémentaire", "Talent à choisir"],
          quirks: ["Avidité du Dragon", "Oooohhh... Brillant !"]
        },
        "griffon": {
          body: "d6", mind: "d6", charm: "d6", robustness: 12,
          talents: ["Vol", "Griffes", "Talent à choisir"],
          quirks: ["Égoïste", "Faiblesse à choisir"]
        },
        "hypogriffe": {
          body: "d6", mind: "d6", charm: "d6", robustness: 12,
          talents: ["Vol", "Honorable", "Natation", "Talent à choisir"],
          quirks: ["Protecteur", "Faiblesse à choisir"]
        },
        "kirin": {
          body: "d6", mind: "d6", charm: "d8", robustness: 12,
          talents: ["Télékinésie", "Cœur de Kirin", "Talent à choisir"],
          quirks: ["Nirik", "Faiblesse à choisir"]
        },
        "longma": {
          body: "d6", mind: "d6", charm: "d8", robustness: 12,
          talents: ["Vol", "Souffle Élémentaire", "Ascétisme Draconique", "Talent de Marque de Beauté"],
          quirks: ["Colérique", "Faiblesse à choisir"]
        },
        "minotaure": {
          body: "d10", mind: "d6", charm: "d6", robustness: 12,
          talents: ["Robuste", "Intimidation", "Colérique", "Talent à choisir"],
          quirks: ["Court Fusible", "Faiblesse à choisir"]
        },
        "pégase": {
          body: "d6", mind: "d6", charm: "d6", robustness: 12,
          talents: ["Vol", "Manipulation des Nuages", "Talent de Marque de Beauté"],
          quirks: ["Compétitif", "Faiblesse à choisir"]
        },
        "poney": {
          body: "d8", mind: "d6", charm: "d6", robustness: 14,
          talents: ["Cœur vaillant", "Poney Polyvalent", "Talent de Marque de Beauté"],
          quirks: ["Rustique", "Faiblesse à choisir"]
        },
        "licorne": {
          body: "d4", mind: "d8", charm: "d6", robustness: 12,
          talents: ["Télékinésie", "Sorts avancés", "Talent de Marque de Beauté"],
          quirks: ["Arrogant", "Faiblesse à choisir"]
        },
        "reptilien": {
          body: "d8", mind: "d4", charm: "d6", robustness: 12,
          talents: ["Natation", "Peau Épaisse", "Talent à choisir"],
          quirks: ["Froid", "Faiblesse à choisir"]
        },
        "yack": {
          body: "d10", mind: "d6", charm: "d4", robustness: 16,
          talents: ["Artisanat", "Peau Épaisse", "Massif", "Talent à choisir"],
          quirks: ["Pointilleux", "Faiblesse à choisir"]
        },
        "zèbre": {
          body: "d6", mind: "d8", charm: "d6", robustness: 12,
          talents: ["Toucher Guérisseur", "Pacte Spirituel", "Talent de Marque de Beauté"],
          quirks: ["Langage en Rimes", "Faiblesse à choisir"]
        }
      };

      // --- 🔹 Récupération et validation de la race
      const raceKey = (system.race ?? "").trim().toLowerCase();
      if (!raceKey || !raceData[raceKey]) {
        ui.notifications.warn("⚠️ Race invalide ou non définie !");
        return;
      }
      console.log(raceKey);

      const data = raceData[raceKey];
      console.log(`🐴 Génération de ${actor.name} (${raceKey})`, data);

      // --- 🔹 Mise à jour automatique des caractéristiques
      await actor.update({
        "system.body": data.body,
        "system.mind": data.mind,
        "system.charm": data.charm,
        "system.robustness.max": data.robustness,
        "system.robustness.current": Math.min(system.robustness.current, data.robustness)
      });

      // --- 🔹 Vérifie les talents existants
      const existingTalents = actor.items.filter(i => i.type === "talent").map(i => i.name);
      const missingTalents = data.talents.filter(t => !existingTalents.includes(t));

      // --- 🔹 Vérifie les faiblesses existantes
      const existingQuirks = actor.items.filter(i => i.type === "faiblesse").map(i => i.name);
      const missingQuirks = data.quirks.filter(q => !existingQuirks.includes(q));

      if (missingTalents.length === 0 && missingQuirks.length === 0) {
        ui.notifications.info("✅ Tous les talents et faiblesses sont déjà présents.");
        return;
      }

      console.log(`🔍 Talents manquants :`, missingTalents);
      console.log(`🔍 Faiblesses manquantes :`, missingQuirks);

     // --- 🔹 Recherche dans le compendium 'libersf.inventaire'
      const pack = game.packs.get('tails-of-equestria.inventaire');
      if (!pack) {
        ui.notifications.error("Compendium 'tails-of-equestria.inventaire' introuvable !");
        return;
      }

      // Récupère l'index (léger) une fois pour toutes les recherches
      const index = await pack.getIndex();
      const itemsToAdd = [];

      // Fonction utilitaire pour trouver un item dans l'index (insensible à la casse, exact ou fuzzy)
      const findEntryByName = (name) => {
        const lc = (name || "").toLowerCase().trim();
        // 1) correspondance exacte
        let entry = index.find(e => (e.name || "").toLowerCase() === lc);
        if (entry) return entry;
        // 2) correspondance qui contient le nom (fuzzy)
        entry = index.find(e => lc.includes((e.name || "").toLowerCase()) || (e.name || "").toLowerCase().includes(lc));
        return entry || null;
      };

      // --- 🧩 Ajout des talents manquants
      for (const talentName of missingTalents) {
        let itemFound = null;
        const entry = findEntryByName(talentName);
        if (entry) {
          const id = entry._id ?? entry.id;
          try {
            itemFound = await pack.getDocument(id);
          } catch (err) {
            console.warn(`Erreur en récupérant le document ${talentName} (${id}) du pack :`, err);
            itemFound = null;
          }
        }

        if (itemFound) {
          console.log(`✅ Talent trouvé : ${talentName}`);
          itemsToAdd.push(itemFound.toObject());
        } else {
          console.warn(`⚠️ Talent introuvable : ${talentName}, création d’un placeholder.`);
          itemsToAdd.push({
            name: talentName,
            type: "talent",
            system: {
              niveau: "D6",
              description: "Talent ajouté automatiquement (placeholder)."
            }
          });
        }
      }

      // --- 🧩 Ajout des faiblesses manquantes
      for (const quirkName of missingQuirks) {
        let itemFound = null;
        const entry = findEntryByName(quirkName);
        if (entry) {
          const id = entry._id ?? entry.id;
          try {
            itemFound = await pack.getDocument(id);
          } catch (err) {
            console.warn(`Erreur en récupérant le document ${quirkName} (${id}) du pack :`, err);
            itemFound = null;
          }
        }

        if (itemFound) {
          console.log(`✅ Faiblesse trouvée : ${quirkName}`);
          itemsToAdd.push(itemFound.toObject());
        } else {
          console.warn(`⚠️ Faiblesse introuvable : ${quirkName}, création d’un placeholder.`);
          itemsToAdd.push({
            name: quirkName,
            type: "faiblesse",
            system: {
              description: "Faiblesse ajoutée automatiquement (placeholder)."
            }
          });
        }
      }

      // --- 🔹 Création des documents manquants
      if (itemsToAdd.length > 0) {
        await actor.createEmbeddedDocuments("Item", itemsToAdd);
        ui.notifications.info(`${itemsToAdd.length} élément(s) (talent/faiblesse) ajouté(s) à ${actor.name}.`);
      }


    }




/* ==========================================================
*  Générateur de la fiche de personnage
* ========================================================== */

  /**
   * Gère toutes les actions de génération ou de mise à jour automatique du personnage.
   * @param {PointerEvent} event - L'événement d'origine
   * @param {HTMLElement} target - Élément HTML qui contient [data-action]
   */
  static async #onActorAction(event, target) {
    event.preventDefault();

    const actor = this.actor;
    const action = target.dataset.action;

    if (!actor || !action) return;

    function getRandom(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    switch (action) {

      // 🎲 --- LANCER DE JET ---
      case "roll": {
        const stat =target.dataset.stat;
        const dice =target.dataset.dice;
        await this._generateRoll(actor, stat, dice);
        break;
      }

      default:
        console.warn(`Action inconnue : ${action}`);
    }
  }

/* ==========================================================
*  Onglet de la fiche de personnage
* ========================================================== */
  
  /*conserver le dernier onglet ouvert*/
  /** @override */
  _setActiveTab(tabId) {
      if (!this.actor) return;

      // Stocker l'onglet actif en utilisant l'ID de l'acteur
      localStorage.setItem(`activeTab-${this.actor.id}`, tabId);

      // Masquer tous les onglets
      this.element.querySelectorAll(".tab").forEach(tab => {
          tab.style.display = "none";
      });

      // Afficher seulement l'onglet actif
      const activeTab = this.element.querySelector(`.tab[data-tab="${tabId}"]`);
      if (activeTab) {
          activeTab.style.display = "block";
      }

      // Mettre à jour la classe "active" dans la navigation
      this.element.querySelectorAll(".sheet-tabs [data-tab]").forEach(tab => {
          tab.classList.remove("active");
      });

      const activeTabNav = this.element.querySelector(`.sheet-tabs [data-tab="${tabId}"]`);
      if (activeTabNav) {
          activeTabNav.classList.add("active");
      }

      const GM = game.user.isGM;
      if (!GM) { // Vérifie si le joueur n'est PAS GM
        document.querySelectorAll('.reponse').forEach(element => {
          element.style.display = "none"; // Corrigé "this" -> "element"
        });
      }
  }


  
  /** Gestion des onglets */
  #getTabs() {
    const tabs = {
      carac: { id: "carac", group: "sheet", icon: "fa-solid fa-shapes", label: "Pony.Labels.carac" },
      items: { id: "items", group: "sheet", icon: "fa-solid fa-shapes", label: "Pony.Labels.items" },
    };

    for (const v of Object.values(tabs)) {
      v.active = this.tabGroups[v.group] === v.id;
      v.cssClass = v.active ? "active" : "";
    }
    return tabs;
  }


/* ==========================================================
*  Item de la fiche de personnage
* ========================================================== */
  static async #onItemAction(event, target) {
    event.preventDefault();

    const action = target.dataset.action;
    const itemId = target.dataset.itemId;
    const actor = this.actor;
    const item = actor.items.get(itemId);

    //if (!item) return ui.notifications.warn("Item introuvable.");

    switch (action) {

      /* --- 🛠️ ÉDITION --- */
      case "edit":
        return item.sheet.render(true);

      /* --- 🗑️ SUPPRESSION --- */
      case "delete":
        return item.delete();

      /* --- ⚔️ UTILISATION SIMPLE (consommable) --- */
      case "use": {
        const qty = item.system.quantity || 0;
        if (qty > 1) await item.update({ "system.quantity": qty - 1 });
        else await item.delete();
        return;
      }

      /* --- ➕ AJOUT D’UN OBJET --- */
      case "addItem": {
        const newItem = await Item.create({
          name: game.i18n.localize("Pony.Character.Sheet.Objet"),
          type: "item",
          system: {
            quantity: 1,
            description: ""
          }
        }, { parent: actor });
        return ui.notifications.info(`Objet "${newItem.name}" ajouté à ${actor.name}.`);
      }

      /* --- ✨ AJOUT D’UNE MAGIE --- */
      case "addMagic": {
        const newItem = await Item.create({
          name: game.i18n.localize("Pony.Character.Sheet.Talent"),
          type: "talent",
          system: {
            dice: "d4",
            description: ""
          }
        }, { parent: actor });
        return ui.notifications.info(`Talent "${newItem.name}" ajoutée à ${actor.name}.`);
      }
      /* --- ✨ AJOUT D’UNE MAGIE --- */
      case "addDefaut": {
        const newItem = await Item.create({
          name: game.i18n.localize("Pony.Character.Sheet.Faiblesse"),
          type: "faiblesse",
          system: {
            dice: "d4",
            description: ""
          }
        }, { parent: actor });
        return ui.notifications.info(`Defaut "${newItem.name}" ajoutée à ${actor.name}.`);
      }

      default:
        console.warn(`Action inconnue : ${action}`);
    }
  }


/* ==========================================================
*  Action de la fiche de personnage
* ========================================================== */ 
  /**
 * Gère un jet de caractéristique (ex : Corps, Esprit, Charme)
 * @param {Actor} actor - L'acteur qui fait le jet
 * @param {string} stat - Le nom de la caractéristique (ex: "body")
 */
  async _generateRoll(actor, stat, dice) {
    const system = actor.system;
    let label;
    let statValue;
    let dieSides;

    // 🎲 1. Gestion d’un dé transmis directement (ex: "d8" ou "d20+d10")
    if (dice) {
      label = stat;
      if (dice === "d30") dice = "d20+1d10";
      dieSides = "1" + dice;
    } else {
      label = stat.charAt(0).toUpperCase() + stat.slice(1);

      // ✅ Tableau de correspondance des dés
      const diceMap = {
        D4: "1d4",
        D6: "1d6",
        D8: "1d8",
        D10: "1d10",
        D12: "1d12",
        D20: "1d20"
      };

      // Récupération du dé de l'attribut
      statValue = system[stat]?.toUpperCase() ?? "D6";
      dieSides = diceMap[statValue] || "1d6";
    }

    // 🎯 2. Demander la difficulté et le talent à l'utilisateur
    const result = await new Promise(resolve => {
      new DifficultyDialogV2(actor, resolve).render(true);
    });

    if (!result) return; // Annulé
    const { diff: level, talent } = result;

    // 🎓 3. Identifier le dé du talent choisi
    let talentName = "Aucun talent";
    let talentDice = null;

    if (talent && talent !== "none") {
      const talentItem = actor.items.get(talent);
      if (talentItem) {
        talentName = talentItem.name;
        // Exemple : ton talent a une propriété "system.dice" = "D8"
        const talentDie = talentItem.system?.dice?.toUpperCase?.() ?? "D6";
        const diceMap = { D4: "1d4", D6: "1d6", D8: "1d8", D10: "1d10", D12: "1d12", D20: "1d20" };
        talentDice = diceMap[talentDie] || "1d6";
      }
    }

    // 🎆 4. Fonction de jet explosif (avec cumul des explosions)
    const rollExplode = async (formula) => {
      const match = formula.match(/(\d+)d(\d+)/i);
      const sides = match ? parseInt(match[2]) : 6;
      let total = 0;
      let rolls = [];
      let keepRolling = true;

      while (keepRolling) {
        const r = new Roll(formula);
        await r.evaluate();
        const result = r.total;
        total += result;
        rolls.push(result);

        keepRolling = (result === sides);
      }

      const detail = rolls
        .map(r => (r === sides ? `<span class="explosif">${r}</span>` : `${r}`))
        .join(" + ");

      return { total, detail };
    };

    // 🎲 5. Lancer les dés (attribut et talent)
    const rollAttr = await rollExplode(dieSides);
    let bestResult = rollAttr;
    let rollTalent = null;

    if (talentDice) {
      rollTalent = await rollExplode(talentDice);
      if (rollTalent.total > rollAttr.total) bestResult = rollTalent;
    }

    // 🧩 6. Déterminer la réussite
    const success = bestResult.total >= level;
    const resultText = success
      ? `<span style="background:#bbe9f0;color:#f237a6;width: 100%;display: block;text-align: center;padding: 10px;">Succès !</span>`
      : `<span style="background:#f237a6;color:#bbe9f0;width: 100%;display: block;text-align: center;padding: 10px;">Échec.</span>`;

    // 💬 7. Construire le message du chat
    const jetLabel = game.i18n.localize("Pony.Character.Sheet.Jet") ?? "Jet";
    const parts = [
      `🎲 <b>${jetLabel} ${label}</b> (${statValue ?? dieSides}) de <b>${actor.name}</b>`,
      `<span class="resultdice">Difficulté : <b>${level}</b></span>`,
      `<span class="resultdice"><b>Attribut :</b> ${rollAttr.detail} = <b>${rollAttr.total}</b>`,
    ];

    if (rollTalent) {
      parts.push(`<b>Talent (${talentName}) :</b> ${rollTalent.detail} = <b>${rollTalent.total}</b>`);
      parts.push(`<b>Résultat retenu :</b> ${bestResult.total}`);
    }
    parts.push('</span>');
    const message = `${parts.join("<br/>")}<br/>${resultText}`;

    // 💬 8. Envoi du message dans le chat
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: message,
    });

    console.log(`${actor.name} lance ${dieSides}${talentDice ? " + " + talentDice : ""} → ${bestResult.total} (DC ${level}) → ${success ? "Succès" : "Échec"}`);
  }


}
