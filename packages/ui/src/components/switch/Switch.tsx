import { Icon } from '../icon-display';
import s from './Switch.module.scss';

export interface SwitchProps{
  value: boolean,
  // setValue: Dispatch<SetStateAction<boolean>>,
  setValue: (v: boolean) => void,
  disabled?: boolean,
}

export function Switch({
  value,
  setValue,
  disabled
}: SwitchProps){
  return (
    <button 
      type="button"
      className={`${s.switch_btn} ${value ? s.correct : s.cancel}`}
      onClick={() => {setValue(!value)}}
      disabled={disabled}
    >
      <div className={s.circle}>
        <Icon
          name={value ? 'check' : 'cancel'}
          width={12} 
          height={12}
          className={s.icon}
        />
      </div>
    </button>
  );
}