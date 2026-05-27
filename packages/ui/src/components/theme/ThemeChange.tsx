import { Icon } from '../icon-display';
import s from './ThemeChange.module.scss';

export interface ThemeChangeProps {
  theme: 'light' | 'dark',
  toggleTheme: () => void
}

export function ThemeChange({
  theme,
  toggleTheme,
}: ThemeChangeProps) {
  const names = {
    'light': 'sun',
    'dark': 'moon',
  }

  return (
    <button
      type="button"
      className={`
        ${s.theme_btn}
        ${s[theme]}
      `}
      onClick={toggleTheme}
    >
      <Icon
        name={names[theme]}
        width={20}
        height={20}
        className={`
          ${s.icon}
          ${s[theme]}
        `}
      />
    </button>
  );
}

export default ThemeChange;
