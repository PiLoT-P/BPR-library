import { type TextareaHTMLAttributes } from 'react';
import s from './Textarea.module.scss';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{
  autosize?: boolean;
}

export function Textarea({
  autosize = true,
  className,
  style,
  placeholder = 'Введіть текст',
  ...textareaProps
}: TextareaProps) {

  return (
    <textarea
      {...textareaProps}
      placeholder={placeholder}
      className={`
        ${s.container}
        ${className}
      `}
      style={{ ...style, resize: autosize ? 'none' : 'both' }}
    />
  );
}