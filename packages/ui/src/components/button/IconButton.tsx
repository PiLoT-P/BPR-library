import {  useRef, type ButtonHTMLAttributes, type ChangeEvent } from 'react';
import { Icon } from '../icon-display';
import s from './Button.module.scss';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  size?: number;
  variant?: 'primary' | 'secondary' | 'transparent';
  isActive?: boolean;

  onFileSelect?: (files: FileList) => void;
}

export function IconButton({
  icon,
  size = 28,
  type = 'button',
  variant = 'primary',
  isActive = false,
  className,
  onFileSelect,
  onClick,
  children,
  style,
  ...btnProps
}:IconButtonProps) {
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
      className={`${s.icon_btn} ${s[variant]} ${isActive ? s.active : ''} ${className}`}
      onClick={onFileSelect ? triggerFileInput : onClick}
      style={{
        ...style,
        width: size,
        height: size,
      }}
    >
      <div className={s.circle}>
        <Icon
          name={icon}
          className={s.icon}
        />
      </div>
      {children}
      {!!onFileSelect && (
        <input
          type="file"
          hidden
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      )}
    </button>
  );
}