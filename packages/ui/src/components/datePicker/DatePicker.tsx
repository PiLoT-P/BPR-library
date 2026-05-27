import { useRef, useState } from 'react';
import { IconButton } from '../button';
import { PopUp } from '../popup';
import { Calendar } from '../calendar';
import s from './DatePicker.module.scss';

export interface DatePickerProps {
  value: Date | null | undefined;
  onChange: (date: Date) => void;
  disabled?: boolean;
  blockPastDates?: boolean,
  type?: 'date' | 'month' | 'year'
}

export function DatePicker({
  value,
  onChange,
  disabled = false,
  blockPastDates = false,
  type = 'date',
}: DatePickerProps) {
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateFormated: Date) => {
    const day = dateFormated.getDate().toString().padStart(2, '0');
    const month = (dateFormated.getMonth() + 1).toString().padStart(2, '0');
    const year = dateFormated.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div
      ref={containerRef}
      className={s.container}
      onClick={() => {
        if (!disabled) setOpenCalendar(true);
      }}
    >
      <p className={s.date_text}>{value ? formatDate(value) : 'Не вказано'}</p>
      <IconButton
        variant='secondary'
        icon='my-calendar'
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setOpenCalendar(true);
        }}
      />
      {(openCalendar && containerRef) && (
        <PopUp
          containerRef={containerRef}
          handleClose={() => {
            setOpenCalendar(false)
          }}
          style={{
            padding: '0',
            boxShadow: '',
            background: '',
          }}
        >
          <Calendar
            value={value || new Date()}
            onChange={onChange}
            blockPastDates={blockPastDates}
            type={type}
          />
        </PopUp>
      )}
    </div>
  );
}