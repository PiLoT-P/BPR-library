import './styles/index.css';

import sprite from './assets/icons/symbol-defs.svg?raw';

let injected = false;

export const injectIconSprite = () => {
  if (typeof document === 'undefined') return;
  if (injected) return;

  const div = document.createElement('div');
  div.id = 'svg-sprite';
  div.innerHTML = sprite;

  document.body.prepend(div);

  injected = true;
};

injectIconSprite();

export * from './components/alert';
export * from './components/autocomplete';
export * from './components/button';
export * from './components/calendar';
export * from './components/checkbox';
export * from './components/confirm-action';
export * from './components/data-table';
export * from './components/datePicker';
export * from './components/icon-display';
export * from './components/input';
export * from './components/loader';
export * from './components/modal-box';
export * from './components/pagination';
export * from './components/phone-input';
export * from './components/popup';
export * from './components/switch';
export * from './components/textarea';
export * from './components/theme';
export * from './components/toggle';