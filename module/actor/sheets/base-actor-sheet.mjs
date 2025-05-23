import * as Dice from '../../dice.mjs';

const { api, sheets, ux } = foundry.applications;

export default class BaseActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ['channel-fear', 'actor'],
    tag: 'form',
    position: {
      width: 800,
      height: 630,
    },
    actions: {
      itemCreate: BaseActorSheet.#onItemCreate,
      roll: BaseActorSheet.#onRoll,
    },
    actor: {
      type: undefined, // Defined by subclass
    },
    form: {
      submitOnChange: true,
    },
  };

  static PARTS = {
    header: {
      template: 'systems/channel-fear/templates/actor/parts/actor-header.hbs',
    },
    tabs: {
      template: 'systems/channel-fear/templates/actor/parts/actor-tabs.hbs',
    },
    body: {
      template: 'systems/channel-fear/templates/actor/parts/actor-body.hbs',
    },
    informations: {
      template: 'systems/channel-fear/templates/actor/parts/actor-informations.hbs',
      templates: ['systems/channel-fear/templates/actor/parts/actor-informations-right-part.hbs'],
    },
    abilities: {
      classes: ['flexrow'],
      template: 'systems/channel-fear/templates/actor/parts/actor-abilities.hbs',
    },
    weapons: {
      template: 'systems/channel-fear/templates/actor/parts/actor-weapons-items.hbs',
    },
    bio: {
      classes: ['flexrow'],
      template: undefined,
    },
  };

  static TABS = {
    sheet: [
      { id: 'informations', group: 'sheet', label: 'CF.CharacterSheet.Informations' },
      { id: 'abilities', group: 'sheet', label: undefined },
      { id: 'bio', group: 'sheet', label: undefined },
    ],
  };

  tabGroups = {
    sheet: 'informations',
  };

  /**
   * A method which subclasses can call in a static initialization block to refine configuration options at the
   * class level.
   */
  static _initializeActorSheetClass() {
    const actor = this.DEFAULT_OPTIONS.actor;

    this.PARTS = foundry.utils.deepClone(this.PARTS);
    this.PARTS.bio.template = `systems/channel-fear/templates/actor/parts/actor-${actor.type}-bio.hbs`;

    this.TABS = foundry.utils.deepClone(this.TABS);

    this.DEFAULT_OPTIONS.classes = [actor.type];
  }

  /** @override */
  async _prepareContext() {
    const tabGroups = this.#getTabs();

    return {
      tabGroups,
      tabs: tabGroups.sheet,
      actor: this.document,
      system: this.document.system,
      fields: this.document.schema.fields,
      systemFields: this.document.system.schema.fields,
      source: this.document.toObject(),
      isNpc: 'npc' === this.document.type,
      abilitiesList: CONFIG.CF.abilities,
      editable: this.isEditable,
      ...this.#prepareItems(),
    };
  }

  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);

    if ('bio' === partId) {
      context.enrichedBiography = await ux.TextEditor.enrichHTML(this.actor.system.biography, {
        secrets: this.document.isOwner,
        relativeTo: this.actor,
      });
    }

    return context;
  }

  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);

    if (!game.user.isGM) {
      return;
    }

    this._createContextMenu(this.#getContextMenuOptions, '.item', {
      fixed: true,
    });
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    if (!this.isEditable) {
      return;
    }

    // Autosize textearea
    this.element.querySelectorAll('textarea.autosize').forEach((t) => {
      if ('' !== t.value) {
        t.style.height = t.scrollHeight + 'px';
        t.style.overflowY = 'hidden';
      }

      t.addEventListener('input', () => {
        t.style.height = t.scrollHeight + 'px';
      });
    });
  }

  /**
   * @returns {Record<string, Record<string, ApplicationTab>>}
   */
  #getTabs() {
    const tabs = {};
    for (const [groupId, config] of Object.entries(this.constructor.TABS)) {
      const group = {};
      for (const t of config) {
        const active = this.tabGroups[t.group] === t.id;
        group[t.id] = Object.assign({ active, cssClass: active ? 'active' : '' }, t);
      }
      tabs[groupId] = group;
    }
    return tabs;
  }

  /**
   * @this {BaseActorSheet}
   * @param {PointerEvent} event
   * @returns {Promise<void>}
   */
  static async #onItemCreate(event) {
    const cls = getDocumentClass('Item');
    await cls.createDialog({ type: event.target.dataset.type }, { parent: this.document, pack: this.document.pack });
  }

  static async #onRoll(event) {
    const target = event.target;
    const element = target.dataset?.action ? target : target.closest('[data-action]');
    const { ability, label, itemId } = element.dataset;

    if (ability) {
      await Dice.abilityCheck({
        ability,
        label,
        actor: this.actor,
      });
    }

    if (itemId) {
      const item = this.actor.items.get(itemId);

      if (item) {
        await item.roll();
      }
    }
  }

  #prepareItems() {
    const specialties = [];
    const weapons = [];
    const items = [];

    for (let i of this.document.items) {
      if ('specialty' === i.type) {
        specialties.push(i);
      } else if ('weapon' === i.type) {
        weapons.push(i);
      } else if ('item' === i.type) {
        items.push(i);
      }
    }

    return {
      specialties,
      weapons,
      items,
    };
  }

  #getContextMenuOptions() {
    return [
      {
        name: 'CF.Global.Edit',
        icon: '<i class="fas fa-edit"></i>',
        callback: li => {
          const item = this.document.items.get(li.dataset.itemId);

          item.sheet.render({ force: true });
        },
      },
      {
        name: 'CF.Global.Delete',
        icon: '<i class="fas fa-trash"></i>',
        callback: li => {
          const { top, right } = li.getBoundingClientRect();
          const item = this.document.items.get(li.dataset.itemId);

          return item.deleteDialog({ position: { top, left: right } });
        },
      },
    ];
  }
}
