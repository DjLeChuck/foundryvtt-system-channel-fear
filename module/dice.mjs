const { api, fields, handlebars: { renderTemplate }, ux } = foundry.applications;

export async function abilityCheck({ ability, label, actor }) {
  const {
    difficulty,
    resources,
  } = await _getCheckOptions('CF.Rolls.AbilityCheck.Title', actor.system.attributes.resource);

  await _doCheck({
    dice: ability,
    title: game.i18n.format('CF.Rolls.AbilityCheck.Card.Title', { name: label }),
    usedResources: resources,
    actor,
    difficulty,
  });
}

export async function specialtyCheck(specialty) {
  const actor = specialty.actor;
  const {
    difficulty,
    resources,
  } = await _getCheckOptions('CF.Rolls.SpecialtyCheck.Title', actor.system.attributes.resource);

  await _doCheck({
    dice: actor.system.abilities[specialty.system.ability],
    reroll: {
      available: specialty.system.reroll,
      label: specialty.name,
      type: 'specialty',
    },
    title: game.i18n.format('CF.Rolls.SpecialtyCheck.Card.Title', { name: specialty.name }),
    usedResources: resources,
    actor,
    difficulty,
  });
}

export async function weaponCheck(weapon) {
  const actor = weapon.actor;
  const {
    difficulty,
    resources,
  } = await _getCheckOptions('CF.Rolls.WeaponCheck.Title', actor.system.attributes.resource);

  await _doCheck({
    dice: actor.system.abilities[weapon.system.ability],
    title: game.i18n.format('CF.Rolls.WeaponCheck.Card.Title', { name: weapon.name }),
    usedResources: resources,
    actor,
    difficulty,
    weapon,
  });
}

export async function reroll({ actor, available, bonus, difficulty, label, type, usable }) {
  const i18nKey = 'specialty' === type ? 'CF.Rolls.SpecialtyCheck.Card.Title' : 'CF.Rolls.Damages.Card.Title';

  await _doCheck({
    dice: usable,
    reroll: {
      available: available - usable,
      type: type,
      label,
    },
    title: game.i18n.format(i18nKey, { name: label }),
    actor,
    bonus,
    difficulty,
  });
}

export async function useWeapon({ actor, dice, label, reroll }) {
  const rollResult = await _getRollResult(dice);
  const usable = Math.min(reroll, _getNbFailure(rollResult));
  const canReroll = 0 < reroll && 0 < usable;
  const templateData = {
    actorId: actor.id,
    formula: rollResult.formula,
    reroll: {
      available: reroll,
      can: canReroll,
      type: 'weapon',
      label,
      usable,
    },
    title: game.i18n.format('CF.Rolls.Damages.Card.Title', { name: label }),
    tooltip: await rollResult.getTooltip(),
    total: rollResult.total,
  };

  if (!canReroll) {
    templateData.success = 0 < rollResult.total;
    templateData.failure = !templateData.success;
  }

  const chatContent = await renderTemplate('systems/channel-fear/templates/partials/roll/roll-card.hbs', templateData);

  await _createChatMessage(actor, rollResult, chatContent);
}

async function _doCheck({ actor, bonus, dice, difficulty, reroll, title, usedResources, weapon }) {
  if (usedResources) {
    // Ensure to not use more resources than necessary
    usedResources = Math.min(difficulty, usedResources);
  }

  const score = (usedResources || 0) + (bonus || 0);

  // Current score = difficulty level -> no roll
  if (score === difficulty) {
    await _rollNoRoll({
      actor,
      difficulty,
      title,
      weapon,
    });

    await _handleRollResult({ canReroll: false, actor, difficulty, usedResources });

    return;
  }

  const rollResult = await _getRollResult(dice, score);
  const usableRoll = reroll ? Math.min(reroll.available, _getNbFailure(rollResult)) : 0;
  let success = false;
  let failure = false;
  let hardSuccess = false;
  let hardFailure = false;
  let rerollData = { can: false };

  if (difficulty) {
    success = difficulty <= rollResult.total;
    hardSuccess = 1 < difficulty && difficulty < rollResult.total;
  }

  // Reroll available
  if (!success && 0 < usableRoll) {
    rerollData = {
      available: reroll.available,
      can: true,
      label: reroll.label,
      type: reroll.type,
      usable: usableRoll,
    };
  } else {
    failure = difficulty > rollResult.total;
    hardFailure = 1 < difficulty && 0 === rollResult.total;
  }

  if (reroll && !rerollData.can && 'weapon' === reroll.type) {
    success = 0 < rollResult.total;
    failure = !success;
  }

  const chatContent = await renderTemplate('systems/channel-fear/templates/partials/roll/roll-card.hbs', {
    actorId: actor.id,
    formula: rollResult.formula,
    reroll: rerollData,
    tooltip: await rollResult.getTooltip(),
    total: rollResult.total,
    difficulty,
    failure,
    hardFailure,
    hardSuccess,
    success,
    title,
    weapon,
  });

  await _createChatMessage(actor, rollResult, chatContent);
  await _handleRollResult({ actor, canReroll: rerollData.can, difficulty, rollResult, usedResources });
}

function _getRollResult(dice, bonus) {
  let formula = `${dice}d6x6cs>3`;
  if (0 < bonus) {
    formula = `${bonus} + ${formula}`;
  }

  return new Roll(formula).roll();
}

async function _rollNoRoll({ title, actor, difficulty, weapon }) {
  const chatContent = await renderTemplate('systems/channel-fear/templates/partials/roll/roll-card.hbs', {
    actorId: actor.id,
    failure: false,
    success: true,
    total: difficulty,
    difficulty,
    title,
    weapon,
  });

  _createChatMessage(actor, null, chatContent, CONST.CHAT_MESSAGE_STYLES.OTHER);
}

function _createChatMessage(actor, rollResult, content, style = null) {
  const data = {
    content,
    user: game.user,
    speaker: ChatMessage.getSpeaker({ actor }),
    rolls: [rollResult],
    sound: CONFIG.sounds.dice,
  };

  if (null !== style) {
    data.style = style;
  }

  foundry.documents.ChatMessage.implementation.applyRollMode(data, 'roll');
  return foundry.documents.ChatMessage.implementation.create(data);
}

async function _getCheckOptions(title, currentActorResource) {
  const resourceChoices = [];
  if (0 < currentActorResource) {
    for (let i = 0; i <= currentActorResource; i++) {
      resourceChoices.push({
        label: i,
        value: i,
      });
    }
  }

  const difficultyGroup = fields.createFormGroup({
    rootId: 'difficulty',
    input: fields.createSelectInput({
      name: 'difficulty',
      options: [
        {
          label: game.i18n.localize('CF.Rolls.Dialog.Difficulty1'),
          value: '1',
        }, {
          label: game.i18n.localize('CF.Rolls.Dialog.Difficulty2'),
          value: '2',
        }, {
          label: game.i18n.localize('CF.Rolls.Dialog.Difficulty3'),
          value: '3',
        }, {
          label: game.i18n.localize('CF.Rolls.Dialog.Difficulty4'),
          value: '4',
        },
      ],
    }),
    label: game.i18n.localize('CF.Rolls.Dialog.Difficulty'),
  });

  let content = difficultyGroup.outerHTML;

  if (resourceChoices.length) {
    const resourcesGroup = fields.createFormGroup({
      rootId: 'resources',
      input: fields.createSelectInput({
        options: resourceChoices,
        name: 'resources',
      }),
      label: game.i18n.localize('CF.Rolls.Dialog.ResourcesToUse'),
    });

    content += ` ${resourcesGroup.outerHTML}`;
  }

  const data = await api.DialogV2.wait({
    content,
    window: { title: game.i18n.localize(title) },
    buttons: [
      {
        action: 'roll',
        label: 'CF.Global.RollDice',
        icon: 'fas fa-dice-d6',
        callback: (_event, button) => new ux.FormDataExtended(button.form).object,
      }, {
        label: 'CF.Global.Cancel',
        icon: 'fas fa-times',
        default: true,
      },
    ],
  });

  return new Promise(resolve => {
    if (data) {
      resolve(_processAbilityCheckOptions(data));
    }
  });
}

function _processAbilityCheckOptions({ difficulty, resources = '' }) {
  return {
    difficulty: parseInt(difficulty, 10),
    resources: parseInt(resources, 10),
  };
}

async function _handleRollResult({ actor, canReroll, difficulty, rollResult, usedResources }) {
  let newResources = actor.system.attributes.resource;

  // Remove used resource points
  if (0 < usedResources) {
    newResources -= usedResources;
  }

  // Margin of success/failure if difficulty > 1
  if (!canReroll && rollResult && 1 < difficulty) {
    if (rollResult.total > difficulty) {
      // Hard success -> +1 resource point
      ++newResources;
    } else if (0 === rollResult.total) {
      // Hard failure -> -1 resource point
      --newResources;
    }
  }

  // Update if needed
  if (newResources !== actor.system.attributes.resource) {
    await actor.update({ 'system.attributes.resource': Math.min(newResources, CONFIG.CF.maxResource) });
  }
}

function _getNbFailure(rollResult) {
  return rollResult.dice[0].results.reduce(
    (prev, result) => prev + (result.success ? 0 : 1),
    0,
  );
}
