const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export default class DifficultyDialogV2 extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(actor, resolve, options = {}) {
    super(options);
    this.actor = actor;
    this._resolve = resolve;
  }

  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["tails-of-equestria", "dialog"],
    tag: "form",
    position: { width: 320, height: "auto" },
    window: {
      resizable: false,
      title: "Choix de la difficulté et du talent",
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

    // Liste des difficultés
    context.difficulties = [
      { value: 0, label: "Facile (0)" },
      { value: 4, label: "Moyen (4)" },
      { value: 8, label: "Difficile (8)" },
      { value: 12, label: "Très difficile (12)" },
      { value: 16, label: "Extrême (16)" }
    ];

    // Liste des talents de l'acteur
    const talents = this.actor?.items
      ?.filter(i => i.type === "talent")
      ?.map(t => ({ id: t.id, name: t.name })) ?? [];

    // Ajout de l'option "Aucun talent"
    context.talents = [{ id: "none", name: "Aucun talent" }, ...talents];

    return context;
  }

  /** @override */
  async _onRender(context, options) {
    await super._onRender(context, options);
    const input = this.element.querySelector("#diff");
    if (input) input.focus();
  }

  /** Action : Confirmer */
  static async _onConfirm(event, target) {
    event.preventDefault();
    const form = this.element;
    const diff = parseInt(form.querySelector("#diff").value);
    const talent = form.querySelector("#talent-select")?.value ?? "none";
    this._resolve({ diff, talent });
    this.close();
  }

  /** Action : Annuler */
  static async _onCancel(event, target) {
    event.preventDefault();
    this._resolve(null);
    this.close();
  }

  /** @override */
  async close(options = {}) {
    if (this._resolve) {
      this._resolve(null);
      this._resolve = null;
    }
    return super.close(options);
  }
}
