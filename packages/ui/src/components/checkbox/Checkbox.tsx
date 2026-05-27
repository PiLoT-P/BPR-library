import { InputHTMLAttributes, useState } from 'react';
import s from './Checkbox.module.scss';
import { Icon } from '../icon-display';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Checkbox({
  className,
  id,
  ...props
}:CheckboxProps) {
  const [ripple, setRipple] = useState(false);

  const handleRipple = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
  };

  return (
    <label
      className={`${s.custom_checkbox} ${className}`}
      onMouseDown={handleRipple}
      htmlFor={id}
      onClick={(e) => e.stopPropagation()}
    >
      <input id={id} type="checkbox" className={s.checkbox} {...props} />
      <span className={s.box}>
        {ripple && <span className={s.ripple} />}
        <Icon
          name='check'
          width={12}
          height={12}
          className={s.icon}
        />
      </span>
    </label>
  );
}

export default Checkbox;
