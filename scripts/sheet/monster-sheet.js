const ActorSheetV2 = foundry.applications.sheets.ActorSheetV2;
const { HandlebarsApplicationMixin } = foundry.applications.api;


/** Gestion de la feuille de personnage */

export default class PonyMonsterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["tails-of-equestria", "actor", "character"],
    position: { width: 685, height: 890 },
    form: { submitOnChange: true },
    window: {
      resizable: true,
      title: "Fiche de personnage", // <- titre de la fenêtre
      id: "pony-character-sheet",   // <- identifiant unique
      frame: true,                  // <- force la création d’une fenêtre
      icon: "fa-solid fa-horse",    // <- facultatif
    },
    dragDrop: [{ dragSelector: '[data-drag]', dropSelector: '.list' }], // Remplacer '.inventory-list' par votre sélecteur    tabGroups: { sheet: "inventory" },
    actions: {
      editImage: PonyMonsterSheet.#onEditImage,
      edit: PonyMonsterSheet.#onItemAction,
      use: PonyMonsterSheet.#onItemAction,
      delete: PonyMonsterSheet.#onItemAction,
      roll:PonyMonsterSheet.#onActorAction,
      addItem:PonyMonsterSheet.#onItemAction,
      addMagic:PonyMonsterSheet.#onItemAction,
      addDefaut:PonyMonsterSheet.#onItemAction
    }
  };

  /** @override */
  static PARTS = {
    header: { template: "systems/tails-of-equestria/templates/actors/monstre-header.hbs" },
    nav: { template: "systems/tails-of-equestria/templates/actors/character-nav.hbs" },
    biography: { template: "systems/tails-of-equestria/templates/actors/character-biography.hbs" },
    main: { template: "systems/tails-of-equestria/templates/actors/character-main.hbs" }
  };



  /** Préparation des données */
  async _prepareContext() {
    // 🔹 Référence au système de données
    const system = this.document.system;

    // 🔹 Retourne le contexte pour le template
    return {
      tabs: this.#getTabs(),
      fields: this.document.schema.fields,
      systemFields: system.schema.fields,
      actor: this.document,
      system: system,
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
    const el = this.element[0]; // wrapper principal
    const system = this.actor.system;

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
    let dieSides;
    let statValue;
    // dice retourne d4 d6 d8 d10 d12 d20 ou d20+d10
    if (dice) {
      label = stat;
      if(dice="d30"){dice="d20+1d10"}
      dieSides = "1" + dice;
    } else {
      label = stat.charAt(0).toUpperCase() + stat.slice(1);

      // ✅ Tableau de correspondance dés
      const diceMap = {
        D0: "1d0",
        D1: "1d1",
        D4: "1d4",
        D6: "1d6",
        D8: "1d8",
        D10: "1d10",
        D12: "1d12",
        D20: "1d20",
        D30: "1d20 + 1d10",
        D60: "3d20",
        D100: "5d20"
      };

      // Récupération du dé associé
      statValue = system[stat]?.toUpperCase() ?? "D6";
      dieSides = diceMap[statValue] || "1d6";
    }

    // ✅ Création et évaluation du roll (Foundry v13)
    const roll = new Roll(dieSides);
    await roll.evaluate();

    const jet = game.i18n.localize("Pony.Character.Sheet.Jet");

    // ✅ Affichage dans le chat
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor }),
      flavor: `🎲 ${jet} ${label} (${statValue}) de ${actor.name}`,
    });

    // ✅ Debug console
    console.log(`${actor.name} lance ${statValue} (${dieSides}) :`, roll.total);
  }

}