const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export default class DifficultyDialogV2 extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(resolve, options = {}) {
    super(options);
    this._resolve = resolve;
  }

  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["tails-of-equestria", "dialog"],
    tag: "form",
    position: { 
      width: 300, 
      height: "auto" 
    },
    window: {
      resizable: false,
      title: "Choix de difficulté",
      id: "difficulty-dialog",
      frame: true,
      icon: "fa-solid fa-dice"
    },
    actions: {
      confirm: DifficultyDialogV2._onConfirm,
      cancel: DifficultyDialogV2._onCancel
    }
  };

  /** @override */
  static PARTS = {
    form: {
      template: "systems/tails-of-equestria/templates/chat/dialog.hbs"
    }
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    
    // Ajoutez ici les données que vous voulez passer au template
    context.difficulties = [
      { value: 0, label: "Facile (0)" },
      { value: 4, label: "Moyen (4)" },
      { value: 8, label: "Difficile (8)" },
      { value: 12, label: "Très difficile (12)" },
      { value: 16, label: "Extrême (16)" }
    ];
    
    return context;
  }

  /** @override */
  async _onRender(context, options) {
    await super._onRender(context, options);
    
    // Focus automatique sur le champ de saisie
    const input = this.element.querySelector("#diff");
    if (input) input.focus();
  }

  /** Action : Confirmer */
  static async _onConfirm(event, target) {
    event.preventDefault();
    
    const form = this.element;
    const input = form.querySelector("#diff");
    const value = input ? parseInt(input.value) : 0;
    
    this._resolve(value);
    this.close();
  }

  /** Action : Annuler */
  static async _onCancel(event, target) {
    event.preventDefault();
    this._resolve(null);
    this.close();
  }

  /** @override - Gérer la fermeture sans choix */
  async close(options = {}) {
    // Si fermé sans avoir choisi, renvoyer null
    if (this._resolve) {
      this._resolve(null);
      this._resolve = null;
    }
    return super.close(options);
  }
}