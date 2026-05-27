import { type InputHTMLAttributes } from 'react';
import s from './Input.module.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  fullWidth?: boolean
}

export function Input({
  fullWidth = false,
  className,
  style,
  placeholder = 'Введіть значення',
  ...inputProps
}: InputProps) {
  return (
    <input
      {...inputProps}
      className={`${s.text_field} ${className}`}
      style={{
        width: fullWidth ? '100%' : 'min-content',
        ...style,
      }}
      placeholder={placeholder}
    />
  );
}