import {getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
const {hasCommandModifier} = KeyBindingUtil;

export const commands = {
  SPECIAL_SYMBOL: 'revey-special-symbol',
  EVAL_CELL: 'revey-eval-cell'
};

export function myKeyBindingFn(e) {
  if (e.keyCode === 192 /* tilde key */) {
    return commands.SPECIAL_SYMBOL;
  }

  if (e.keyCode === 13 /* enter key */ && hasCommandModifier(e)) {
    return commands.EVAL_CELL;
  }

  return getDefaultKeyBinding(e);
}