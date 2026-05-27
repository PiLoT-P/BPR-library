import { InputHTMLAttributes } from 'react';
import s from './Toggle.module.scss';

export interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Toggle({
  style,
  className,
  id,
  ...props
}: ToggleProps){
  return (
    <label 
      htmlFor={id} 
      className={s.container}
      onClick={(e) => e.stopPropagation()}
    >
      <input id={id} type="checkbox" {...props} style={{ display: 'none', ...style }} className={`${s.checkbox} ${className}`} />
      <div className={s.ellipse} />
    </label>
  );
}