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

export function hideActionsButtons(html) {
  const actionsContainer = html.querySelector('.channel-fear.chat-actions');
  if (!actionsContainer) {
    return;
  }

  const actor = game.actors.get(actionsContainer.dataset.actorId);
  if (actor && !actor.isOwner) {
    actionsContainer.style.display = 'none';
  }
}

async function _handleReroll(e) {
  e.preventDefault();

  const data = e.currentTarget.dataset;
  const actor = await game.actors.get(data.actorId);

  if (!actor) {
    return;
  }

  const message = await game.messages.get(e.currentTarget.closest('.chat-message').dataset.messageId);

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

  await Dice.reroll({ actor, available, bonus, difficulty, label, type, usable, message });
}

async function _handleWeaponDamages(e) {
  e.preventDefault();

  const data = e.currentTarget.dataset;
  const actor = await game.actors.get(data.actorId);

  if (!actor) {
    return;
  }

  const { dice, label, reroll } = data;

  await Dice.useWeapon({ actor, dice, label, reroll });
}
