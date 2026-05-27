import { useEffect, useState } from 'react';
import s from './Alert.module.scss';
import { Icon } from '../icon-display';

type severityType = 'error' | 'warning' | 'info' | 'success';

export interface AlertProps {
  open: boolean,
  message: string,
  severity: severityType,
  onClose: () => void,
}

export function Alert ({
  message,
  severity,
  open,
  onClose,
}: AlertProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer: number;
    let unmountTimer: number;

    if (open) {
      setTimeout(() => {setVisible(true)}, 100);
      hideTimer = window.setTimeout(() => setVisible(false), 3000);
      unmountTimer = window.setTimeout(() => onClose(), 3000 + 300);
    }

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(unmountTimer);
    };
  }, [open, 3000, onClose]);

  if (!open && !visible) return null;

  return(
    <div className={`
      ${s.container}
      ${visible ? s.open : s.close}
      ${s[severity]}
    `}>
      <Icon
        name={`alert-${severity}`}
        width={18} 
        height={18} 
        className={s.icon}
      />
      <p className={s.message_text}>
        {message}
      </p>
    </div>
  );
}