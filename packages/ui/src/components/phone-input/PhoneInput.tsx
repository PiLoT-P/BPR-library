import { ChangeEvent, InputHTMLAttributes } from 'react';
import s from './PhoneInput.module.scss';

export interface PhoneInputProps extends InputHTMLAttributes<HTMLInputElement>{
  fullWidth?: boolean
}

// Обов'язково передати onChange
export function PhoneInput({
  fullWidth = false,
  onChange,
  style,
  className,
  value = '+380',
  ...inputProps
}: PhoneInputProps) {
  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');

    let cleaned = digits.startsWith('380') ? digits.slice(3) : digits;
    cleaned = cleaned.slice(0, 9);

    const part1 = cleaned.slice(0, 2);
    const part2 = cleaned.slice(2, 5);
    const part3 = cleaned.slice(5, 7);
    const part4 = cleaned.slice(7, 9);

    let result = '+380';
    if (part1) result += ` (${part1}`;
    if (part1.length === 2) result += ')';
    if (part2) result += ` ${part2}`;
    if (part3) result += `-${part3}`;
    if (part4) result += `-${part4}`;

    return result;
  };

  const handleFilteringValue = (e: ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, '');

    // прибираємо зайве "380", якщо вставили з кодом
    if (digits.startsWith('380')) {
      digits = digits.slice(3);
    }

    digits = digits.slice(0, 9);

    const fullNumber = `+380${digits}`;

    if (onChange) {
      onChange({
        ...e,
        target: { ...e.target, value: fullNumber },
      } as ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <input
      {...inputProps}
      value={formatPhone(String(value))}
      onChange={handleFilteringValue}
      style={{
        width: fullWidth ? '100%' : 'min-content',
        ...style,
      }}
      className={`
        ${s.field}
        ${className}
      `}
      placeholder="(XX) XXX-XX-XX"
      type="tel"
      inputMode="numeric"
    />
  );
}