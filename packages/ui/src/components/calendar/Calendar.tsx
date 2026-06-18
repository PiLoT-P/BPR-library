import { useCallback, useState } from 'react';
import s from './Calendar.module.scss';
import { IconButton } from '../button';
import { areDatesEqual, isDateInPast } from '../../utils';

export interface CalendarProps{
  value: Date
  onChange: (date: Date) => void
  blockPastDates?: boolean
  type?: 'date' | 'month' | 'year'
}

const monthNames = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень',
];

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

export function Calendar({
  value,
  onChange,
  blockPastDates = false,
  type = 'date',
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(value));
  const [select, setSelect] = useState<boolean>(type === 'date' ? false : true);
  const isSelectedYear = currentDate.getFullYear() === value.getFullYear();

  const handleGenerateDates = useCallback((date: Date) => {
    const days: {date: Date, isCurrentMonth: boolean, isPastDate: boolean}[] = [];

    const year = date.getFullYear();
    const month = date.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const newDate = new Date(year, month, day);
      days.push({
        date: newDate,
        isCurrentMonth: true,
        isPastDate: isDateInPast(newDate),
      });
    }

    const positionFirstWeekDay = (
      days[0].date.getDay() === 0 ?
        7 : days[0].date.getDay()) - 1; // Коригуємо для понеділка
    const positionLastWeekDay = (
      days[days.length - 1].date.getDay() === 0 ?
        7 : days[days.length - 1].date.getDay()) - 1;

    if (positionFirstWeekDay > 0) {
      for (let day = 1; day <= positionFirstWeekDay; day++) {
        const previousDate = new Date(year, month, 1 - day); // Додаємо дні до початку місяця
        days.unshift({
          date: previousDate,
          isCurrentMonth: false,
          isPastDate: true,
        });
      }
    }

    if (positionLastWeekDay < 6) {
      for (let day = 1; day <= 6 - positionLastWeekDay; day++) {
        const nextDate = new Date(year, month, daysInMonth + day); // Додаємо дні до кінця місяця
        days.push({
          date: nextDate,
          isCurrentMonth: false,
          isPastDate: false,
        });
      }
    }

    return days;
  }, [currentDate])

  const handleNextMonth = () => {
    if (select) {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  }

  const handlePreviousMonth = () => {
    if (select) {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  }

  const handleChangeCurrentMonth = (selectedMonth: number) => {
    if (select) {
      setCurrentDate(new Date(currentDate.getFullYear(), selectedMonth, 1));
      setSelect(false);
    }
  }

  return (
    <div className={s.container}>
      <div className={s.title_block}>
        <IconButton
          icon='arrow-left'
          variant='secondary'
          onClick={handlePreviousMonth}
        />
        {(select) ?
          <p className={s.month}>{currentDate.getFullYear()}</p>
          : (
            <button
              type="button"
              className={s.month}
              onClick={() => {
                setSelect(true);
              }}
            >
              {monthNames[currentDate.getMonth()]}
              {' '}
              <span>{currentDate.getFullYear()}</span>
            </button>
          )}
        <IconButton
          icon='arrow-right'
          variant='secondary'
          onClick={handleNextMonth}
        />
      </div>
      {(!select) ?
        (
          <>
            <ul className={s.week_days_list}>
              {weekDays.map((weekDay, index) => (
                <li key={index} className={s.item}>{weekDay}</li>
              ))}
            </ul>
            <ul className={s.dates_list}>
              {handleGenerateDates(currentDate).map((date, index) => (
                <li
                  key={index}
                  className={s.item}
                >
                  <button
                    type="button"
                    className={`
                      ${s.date_btn}
                      ${areDatesEqual(date.date, value) && s.active}
                      ${!date.isCurrentMonth && s.past_date}
                      ${(blockPastDates && date.isPastDate) && s.past_date}
                    `}
                    onClick={() => {
                      onChange(date.date);
                    }}
                    disabled={blockPastDates && date.isPastDate}
                  >
                    {date.date.getDate()}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )
        : (
          <ul className={s.months_list}>
            {monthNames.map((month, index) => (
              <li
                key={index}
                className={s.item}
              >
                <button
                  type="button"
                  className={`
                    ${s.month_change_btn}
                    ${(isSelectedYear && value.getMonth() === index) && s.active}
                  `}
                  onClick={() => {
                    if(type === 'date'){
                      handleChangeCurrentMonth(index)
                    } else if(type === 'month'){
                      onChange(new Date(currentDate.getFullYear(), index, 1))
                    }
                  }}
                >
                  {month}
                </button>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}