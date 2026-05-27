import {  useRef, type ButtonHTMLAttributes, type ChangeEvent } from 'react';
import { Icon } from '../icon-display';
import s from './Button.module.scss'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  variant?: 'primary' | 'secondary' | 'transparent',
  isActive?: boolean;
  iconOptions?: {
    widht: number;
    height: number;
    padding?: number;
  };

  onFileSelect?: (files: FileList) => void;
  multipleFile?: boolean;
}

export function Button({
  icon,
  children,
  type = 'button',
  variant = 'primary',
  isActive = false,
  iconOptions = {
    height: 15,
    widht: 15,
    padding: 7,
  },
  onFileSelect,
  multipleFile = false,
  onClick,
  className,
  disabled,
  ...btnProps
}: ButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onFileSelect) {
      onFileSelect(e.target.files);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <button
      {...btnProps}
      type={type}
      className={`
                ${s.btn} 
                ${s[variant]} ${icon ? s.icon_padding : ''} 
                ${isActive ? s.active : ''}
                ${disabled ? s.disabled : ''}
                ${className}
            `}
      disabled={disabled}
      onClick={onFileSelect ? triggerFileInput : onClick}
    >
      {children}
      {icon && (
        <div
          className={s.circle}
          style={{
            padding: `${iconOptions.padding}px`,
          }}
        >
          <Icon
            name={icon}
            width={iconOptions.widht} 
            height={iconOptions.height} 
            className={s.icon}
          />
        </div>
      )}
      {!!onFileSelect && (
        <input
          type="file"
          hidden
          multiple={multipleFile}
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={disabled}
        />
      )}
    </button>
  );
}