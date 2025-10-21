const ActorSheetV2 = foundry.applications.sheets.ActorSheetV2;
const { HandlebarsApplicationMixin } = foundry.applications.api;


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
    dragDrop: [{ dragSelector: '[data-drag]', dropSelector: '.inventory-list' }], // Remplacer '.inventory-list' par votre sélecteur    tabGroups: { sheet: "inventory" },
    actions: {
      editImage: PonyCharacterSheet.#onEditImage,
      edit: PonyCharacterSheet.#onItemAction,
      use: PonyCharacterSheet.#onItemAction,
      delete: PonyCharacterSheet.#onItemAction,
      roll:PonyCharacterSheet.#onActorAction,
      addItem:PonyCharacterSheet.#onItemAction,
      addMagic:PonyCharacterSheet.#onItemAction
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
  // 🔹 Référence au système de données
  const system = this.document.system;

  // 🔹 Liste complète des races jouables (selon ton tableau)
  const raceData = {
        "bison": {
          body: "d12", mind: "d6", charm: "d6", robustness: 18,
          talents: ["Charge (D8)", "Peau Épaisse (D4)"],
          quirks: ["Fier - Haut égard de soi ; crée des tensions sociales."]
        },
        "changelin": {
          body: "d4", mind: "d4", charm: "d4", robustness: 8,
          talents: ["Métamorphose (D6)", "Télékinésie (D4)", "Cœur Robuste (D4)", "Vol (D4)"],
          quirks: ["Affamé d’Amour - Besoin d’émotions ; comportement manipulateur."]
        },
        "chat": {
          body: "d6", mind: "d6", charm: "d6", robustness: 12,
          talents: ["Griffes (D6)", "Furtivité (D6)"],
          quirks: ["Égoïste - Méfiant en groupe."]
        },
        "chien de diamant": {
          body: "d6", mind: "d6", charm: "d6", robustness: 12,
          talents: ["Fouissage (D6)", "Pistage (D6)"],
          quirks: ["Avide - Obsédé par les gemmes."]
        },
        "cristal pony": {
          body: "d6", mind: "d6", charm: "d6", robustness: 12,
          talents: ["Cœur Robuste (D6)", "Télékinésie (D6)", "Vol (D6)"],
          quirks: ["Cœur de Cristal - Dépend de ses émotions."]
        },
        "dragon": {
          body: "d8", mind: "d4", charm: "d4", robustness: 12,
          talents: ["Vol (D6)", "Souffle de Feu (D6)"],
          quirks: [
            "Avidité du Dragon - Croît en taille si avide.",
            "Oooohhh... Brillant ! - Distrait par objets précieux."
          ]
        },
        "griffon": {
          body: "d6", mind: "d6", charm: "d6", robustness: 12,
          talents: ["Vol (D6)", "Griffes (D6)"],
          quirks: ["Égoïste - Difficile en équipe."]
        },
        "hippogriffe": {
          body: "d6", mind: "d6", charm: "d6", robustness: 12,
          talents: ["Vol (D6)", "Honorable (D6)", "Natation (D10 en forme sirène)"],
          quirks: ["Protecteur - Obsession de sécurité."]
        },
        "kirin": {
          body: "d6", mind: "d6", charm: "d8", robustness: 12,
          talents: ["Télékinésie (D6)", "Cœur de Kirin (D6)"],
          quirks: ["Nirik - Transformation enragée ; doit choisir un quirk supplémentaire."]
        },
        "livre magique": {
          body: "d4", mind: "d8", charm: "d6", robustness: 12,
          talents: ["Savant Livresque (D6)", "Message (D6)", "Vol (D4)"],
          quirks: ["Vulnérabilité : Feu (D6)"]
        },
        "perroquet": {
          body: "d6", mind: "d6", charm: "d6", robustness: 12,
          talents: ["Vol (D6)", "Imitation (D6)"],
          quirks: ["Bavard - Trop loquace."]
        },
        "pégase": {
          body: "d6", mind: "d6", charm: "d6", robustness: 12,
          talents: ["Vol (D6)", "Manipulation des Nuages (D6)"],
          quirks: ["Compétitif - Crée des conflits inutiles."]
        },
        "poney de terre": {
          body: "d8", mind: "d6", charm: "d6", robustness: 14,
          talents: ["Cœur Robuste (D6)", "Poney Polyvalent (D6)"],
          quirks: ["Rustique - Moins réceptif à la magie."]
        },
        "licorne": {
          body: "d4", mind: "d8", charm: "d6", robustness: 12,
          talents: ["Télékinésie (D6)", "Sorts avancés (optionnels)"],
          quirks: ["Arrogant - Trop fier de la magie."]
        },
        "reptilien": {
          body: "d8", mind: "d4", charm: "d6", robustness: 12,
          talents: ["Natation (D8)", "Peau Épaisse (D6)"],
          quirks: ["Froid - Peu sociable."]
        },
        "yack": {
          body: "d10", mind: "d6", charm: "d4", robustness: 16,
          talents: ["Artisanat (D6)", "Peau Épaisse (D4)", "Massif (D4)"],
          quirks: ["Pointilleux - Obsédé par la perfection."]
        }
      };

      // 🔹 Récupère la race actuelle du personnage
      const raceKey = (system.race ?? "").toLowerCase();

      // 🔹 Si la race existe dans le tableau
      if (raceData[raceKey]) {
        const data = raceData[raceKey];
        system.body = data.body;
        system.mind = data.mind;
        system.charm = data.charm;
        system.robustness.max = data.robustness;
        system.talentsBase = data.talents;
        system.quirksBase = data.quirks;
      }

      // 🔹 Ne pas dépasser le max
      if (system.robustness.current > system.robustness.max)
        system.robustness.current = system.robustness.max;

      // 🔹 Retourne le contexte pour le template
      return {
        tabs: this.#getTabs(),
        fields: this.document.schema.fields,
        systemFields: system.schema.fields,
        actor: this.document,
        system,
        source: this.document.toObject(),
        items: this.document.items.toObject()
      };
    }




  async _preparePartContext(partId, context) {
    return context;
  }

  async _onRender(context, options) {
    super._onRender(context, options);
    //console.log('render')
    console.log(context)


    /* === 🔹 DRAG & DROP === */
/*    el.querySelectorAll('[data-drag]').forEach(item => {
      item.addEventListener('dragstart', () => {}); // placeholder
    });*/

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
        await this._generateRoll(actor, stat);
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
          type: "item",
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
          type: "item",
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
  async _generateRoll(actor, stat) {
    const system = actor.system;
    const label = stat.charAt(0).toUpperCase() + stat.slice(1);

    // Tableau de correspondance dés
    const diceMap = {
      D4: 4,
      D6: 6,
      D8: 8,
      D10: 10,
      D12: 12,
      D20: 20
    };

    // Récupération du dé associé
    const statValue = system[stat];
    const dieSides = diceMap[statValue?.toUpperCase()] ?? 6;

    // Création du roll (Foundry v13)
    const roll = new Roll(`1d${dieSides}`);

    // ⚙️ Nouvelle syntaxe v13 : evaluate() sans options
    await roll.evaluate();
    const jet=game.i18n.localize("Pony.Character.Sheet.Jet");
    // Affichage dans le chat
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor }),
      flavor: `🎲 ${jet} ${label} (${statValue || "D6"}) de ${actor.name}`,
    });

    // Debug
    console.log(`${actor.name} lance ${statValue} (${dieSides} faces) :`, roll.total);
  }

}