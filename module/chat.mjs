import * as Dice from './dice.mjs';

/**
 * @param {HTMLElement} html
 */
export function addChatListeners(html) {
  html.querySelectorAll('.reroll').forEach(
    (el) => el.addEventListener('click', _handleReroll),
  );

  html.querySelectorAll('.use-weapon').forEach(
    (el) => el.addEventListener('click', _handleWeaponDamages),
  );
}

export function showActionsButtons(html) {
  const actionsContainer = html.querySelector('.channel-fear.chat-actions');
  if (!actionsContainer) {
    return;
  }

  const actor = game.actors.get(actionsContainer.dataset.actorId);
  if (actor && actor.isOwner) {
    actionsContainer.classList.remove('d-none');
  }
}

async function _handleReroll(e) {
  e.preventDefault();

  const target = e.currentTarget;
  const data = target.dataset;
  const actor = await game.actors.get(data.actorId);

  if (!actor) {
    return;
  }

  const message = await game.messages.get(target.closest('.chat-message').dataset.messageId);

  if (!message) {
    return;
  }

  const {
    rerollUsable: usable,
    rerollAvailable: available,
    bonus,
    difficulty,
    label,
    type,
  } = data;

  await _removeActions(message);
  await Dice.reroll({ actor, available, bonus, difficulty, label, type, usable });
}

async function _handleWeaponDamages(e) {
  e.preventDefault();

  const target = e.currentTarget;
  const data = target.dataset;
  const actor = await game.actors.get(data.actorId);

  if (!actor) {
    return;
  }

  const { dice, label, reroll } = data;

  const message = await game.messages.get(target.closest('.chat-message').dataset.messageId);
  if (message) {
    await _removeActions(message);
  }

  await Dice.useWeapon({ actor, dice, label, reroll });
}

async function _removeActions(message) {
  let content = message.content;

  const tempElement = document.createElement('div');
  tempElement.innerHTML = content;

  const chatActions = tempElement.querySelector('.chat-actions');
  if (!chatActions) {
    return;
  }

  chatActions.remove();

  await message.update({
    content: tempElement.innerHTML,
  });
}
