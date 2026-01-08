import { FC, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: FC<ButtonProps> = ({ variant = 'primary', className, ...props }) => {
  return (
    <button className={clsx(styles.button, styles[variant], className)} {...props} />
  );
};