import { FC } from 'react';
import s from './Loader.module.scss';

export interface LoaderProps {
  size?: number;
  color?: string;
}

export const Loader: FC<LoaderProps> = ({
  size = 40,
  color = 'var(--text-color)', 
}) => {
  return (
    <div className={s.loader_container}>
      <svg
        className={s.loader}
        viewBox="22 22 44 44"
        style={{ width: size, height: size }}
      >
        <circle
          className={s.loader_circle}
          cx="44"
          cy="44"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}