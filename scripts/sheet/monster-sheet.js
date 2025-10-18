const ActorSheetV2 = foundry.applications.sheets.ActorSheetV2;
const { HandlebarsApplicationMixin } = foundry.applications.api;


/** Gestion de la feuille de personnage */

export default class PonyMonsterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["pony", "actor", "character"],
    position: { width: 685, height: 890 },
    form: { submitOnChange: true },
    window: { resizable: true },
    dragDrop: [{ dragSelector: '[data-drag]', dropSelector: '.inventory-list' }], // Remplacer '.inventory-list' par votre sélecteur    tabGroups: { sheet: "inventory" },
    actions: {
      editImage: PonyMonsterSheet.#onItemAction,
      edit: PonyMonsterSheet.#onItemAction,
      use: PonyMonsterSheet.#onItemAction,
      delete: PonyMonsterSheet.#onItemAction,
      roll:PonyMonsterSheet.#onActorAction
    }
  };

  /** @override */
  static PARTS = {
    tabs: { template: "systems/liber-chronicles/templates/actors/character-navigation.hbs" },
    header: { template: "systems/liber-chronicles/templates/actors/character-header.hbs" },
    biography: { template: "systems/liber-chronicles/templates/actors/character-biography.hbs" },
    main: { template: "systems/liber-chronicles/templates/actors/character-main.hbs" }
  };



  /** Préparation des données */
  async _prepareContext() {
    const items=this.document.items.toObject();
        return {
        tabs: this.#getTabs(),
        fields: this.document.schema.fields,
        systemFields: this.document.system.schema.fields, 
        actor: this.document,
        system: this.document.system,
        source: this.document.toObject(),
        items: this.document.items.toObject()
      };
  }


  async _preparePartContext(partId, context) {
    return context;
  }

  async _onRender(context, options) {
    super._onRender(context, options);
    console.log(context)


    /* === 🔹 DRAG & DROP === */
    el.querySelectorAll('[data-drag]').forEach(item => {
      item.addEventListener('dragstart', () => {}); // placeholder
    });

    /* === 🔹 ONGLET ACTIF === */
    /*conserver le dernier onglet ouvert*/
    if (!this.actor) return;
    // Récupérer l'onglet actif spécifique à ce personnage (ou valeur par défaut)
    const activeTab = localStorage.getItem(`activeTab-${this.actor.id}`) || "background"; 
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
        await this._generateRoll(actor, ability, value, type, itemId, image);
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
      background: { id: "background", group: "sheet", icon: "fa-solid fa-book", label: "Liber.Labels.background" },
      carac: { id: "carac", group: "sheet", icon: "fa-solid fa-shapes", label: "Liber.Labels.carac" },
      features: { id: "features", group: "sheet", icon: "fa-solid fa-shapes", label: "Liber.Labels.features" },
      items: { id: "items", group: "sheet", icon: "fa-solid fa-shapes", label: "Liber.Labels.items" },
      spells: { id: "spells", group: "sheet", icon: "fa-solid fa-shapes", label: "Liber.Labels.spells" },
      lab: { id: "lab", group: "sheet", icon: "fa-solid fa-shapes", label: "Liber.Labels.lab" }
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

      default:
        console.warn(`Action inconnue : ${action}`);
    }
  }


/* ==========================================================
*  Action de la fiche de personnage
* ========================================================== */ 
  async _generateRoll(actor) {
  }

}