import '../scss/channel-fear.scss';

import * as actor from './actor/_module.mjs';
import { ChannelFearItem } from './item/documents/item.mjs';
// import { ChannelFearItemSheet } from './item/sheets/item-sheet.mjs';
import { registerSettings } from './helpers/settings.mjs';
import { CF } from './helpers/config.mjs';
import * as Chat from './chat.mjs';
import { registerHandlebarsHelper } from './helpers/handlerbars-helpers.mjs';

Hooks.on('init', function () {
  console.log('Channel Fear | Initializing System');

  game.channelfear = {
    rollItemMacro,
  };

  CONFIG.CF = CF;

  CONFIG.Item.documentClass = ChannelFearItem;
  CONFIG.Actor.dataModels.character = actor.models.CharacterDataModel;
  CONFIG.Actor.dataModels.npc = actor.models.NpcDataModel;

  CONFIG.fontDefinitions['MuseoSlab'] = {
    editor: true,
    fonts: [{
      urls: ['systems/channel-fear/fonts/museoslab-300.otf'],
    }],
  };
  CONFIG.fontDefinitions['ChalkDuster'] = {
    editor: true,
    fonts: [{
      urls: ['systems/channel-fear/fonts/chalkduster.ttf'],
    }],
  };
  CONFIG.canvasTextStyle.fontFamily = 'MuseoSlab';
  CONFIG.defaultFontFamily = 'MuseoSlab';

  const sheets = foundry.applications.apps.DocumentSheetConfig;
  sheets.unregisterSheet(Actor, 'core', foundry.appv1.sheets.ActorSheet);
  sheets.registerSheet(Actor, CONFIG.CF.SYSTEM_ID, actor.sheets.CharacterActorSheet, {
    types: ['character'],
    makeDefault: true,
  });
  sheets.registerSheet(Actor, CONFIG.CF.SYSTEM_ID, actor.sheets.NpcActorSheet, {
    types: ['npc'],
    makeDefault: true,
  });
  sheets.unregisterSheet(Item, 'core', foundry.appv1.sheets.ItemSheet);
  // sheets.registerSheet(Item, CONFIG.CF.SYSTEM_ID, ChannelFearItemSheet, { makeDefault: true });

  registerHandlebarsHelper();
  registerSettings();
});

Hooks.on('hotbarDrop', (bar, data, slot) => createDocMacro(data, slot));

Hooks.once('babel.init', (babele) => {
  if ('fr' !== game.i18n.lang) {
    babele.setSystemTranslationsDir('lang/packs/translations');
  }
});

Hooks.on('renderChatMessageHTML', (app, html) => {
  Chat.addChatListeners(html);
  Chat.hideActionsButtons(html);
});

function createDocMacro(data, slot) {
  if (data.type !== 'Item') {
    return;
  }

  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn(game.i18n.localize('CF.Warnings.MacroOnlyForOwnedItem'));
  }

  (async function () {
    const item = await Item.fromDropData(data);

    // Create the macro command using the uuid.
    const command = `game.channelfear.rollItemMacro("${data.uuid}");`;
    let macro = game.macros.find((m) => m.name === item.name && m.command === command);
    if (!macro) {
      macro = await Macro.create({
        name: item.name,
        type: 'script',
        img: item.img,
        command: command,
        flags: { 'channelfear.itemMacro': true },
      });
    }

    await game.user.assignHotbarMacro(macro, slot);
  })();

  return false;
}

function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid,
  };

  // Load the item from the uuid.
  Item.fromDropData(dropData).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const name = item?.name ?? itemUuid;
      return ui.notifications.warn(game.i18n.format('CF.Warnings.MacroItemNotFound', { name }));
    }

    // Trigger the item roll
    item.roll();
  });
}
