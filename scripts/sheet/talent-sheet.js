const ItemSheetV2 = foundry.applications.sheets.ItemSheetV2;
const { HandlebarsApplicationMixin } = foundry.applications.api;

/** Gestion de la feuille d'objet */
export default class PonyTalentSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["tails-of-equestria", "item"],
    position: { width: 500, height: 'auto' },
    form: { submitOnChange: true },
    window: {
        title: "Fiche d’objet",
        resizable: true
      },
    actions: {
      editImage: PonyTalentSheet.#onEditImage
    }
  };

  /** @override */
  static PARTS = {
    main:{template: "systems/tails-of-equestria/templates/items/talent.hbs"}
  };

  _onRender(context, options) {
    console.log("Context rendu :", context);
  }


 /** Préparation des données */
  async _prepareContext() {
    console.log("Préparation du contexte de l'objet :", this);
    const context = {
      fields: this.document.schema.fields,              // ✅ Champs généraux
      systemFields: this.document.system.schema.fields, // ✅ Champs système
      source: this.document.toObject(),                 // ✅ Source brute (utile pour debug)
      item: this.document,                              // ✅ Référence à l'objet
      system: this.document.system,
    }
    return context;
  }


  _prepareItemData(itemData) {
    const data = itemData.system;
    console.log(data)
  }

  static async #onEditImage(event, target) {
    const attr = target.dataset.edit;
    const current = foundry.utils.getProperty(this.document, attr);
    const { img } =
      this.document.constructor.getDefaultArtwork?.(this.document.toObject()) ??
      {};
      const FilePickerImpl = foundry.applications.apps.FilePicker.implementation;
      const fp = new FilePickerImpl({
        current,
        type: 'image',
        callback: (path) => {
          this.document.update({ [attr]: path });
        },
        top: this.position.top + 40,
        left: this.position.left + 10,
      });
      return fp.browse();

  }

  async _preparePartContext(partId, context) {
    return context;
  }
}