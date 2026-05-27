import { useRef, useState } from 'react';
import s from './DataTable.module.scss';
import { useDataTablePreferences } from './hook/useDataTablePreferences';
import { IconButton } from '../button';
import { PopUp } from '../popup';
import { Checkbox } from '../checkbox';

interface ClickableRowsProps<T> {
  onRowClick: (row: T) => void;
  isRowClickable: (row: T) => boolean;
}

interface NonClickableRowsProps {
  onRowClick?: never;
  isRowClickable?: never;
}

export interface Column<T> {
  key: keyof T & string;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: number | string;
}

interface BaseDataTableProps<T>{
  tableId: string,
  columns: Column<T>[];
  data: (T & { id: number })[];
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
}

export type DataTableProps<T> =
  BaseDataTableProps<T> &
  (ClickableRowsProps<T> | NonClickableRowsProps)

export function DataTable<T>({
  tableId,
  columns,
  data,
  actions,
  onRowClick,
  isRowClickable,
}: DataTableProps<T>){
  const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false);

  const {
    visibleColumns,
    setVisibleColumns,
  } = useDataTablePreferences(tableId, columns.map(c => String(c.key)));
  
  const settingsContainerRef = useRef<HTMLDivElement | null>(null);

  const filteredColumns = columns.filter(col =>
    visibleColumns.includes(String(col.key)),
  );

  return (
    <section>
      <table className={s.table_container}>
        <thead className={s.table_head}> 
          <tr>
            <th style={{ width: '40px'}}>
              <div ref={settingsContainerRef}> 
                <IconButton
                  icon='settings'
                  onClick={() => {setIsOpenSettings(true)}}
                />
              </div>
            </th>
            {filteredColumns.map(col => (
              <th key={String(col.key)} style={{ width: col.width }}>
                <div className={s.title}>{col.label}</div>
              </th>
            ))}
            {actions && <th><div className={s.title}>Дії</div></th>}
          </tr>
        </thead>
        <tbody className={s.table_body}>
          {data.map(row => (
            <tr key={row.id}>
              <td style={{ width: '40px'}}>
                {(isRowClickable && isRowClickable(row)) &&
                  <IconButton
                    icon='external-link'
                    variant='transparent'
                    onClick={() => {onRowClick(row)}}
                  />
                }
              </td>
              {filteredColumns.map(col => (
                <td key={String(col.key)} style={{ width: col.width }}>
                  <div className={s.content}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '-')}
                  </div>
                </td>
              ))}
              {actions && (
                <td style={{ width: '0' }}>
                  <div className={s.content}>
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {isOpenSettings &&
        <PopUp
          containerRef={settingsContainerRef}
          handleClose={() => {setIsOpenSettings(false)}}
        >
          <ul className={s.column_filter_list}>
            {columns.map((column) => {
              const key = column.key;
              return (
                <li key={String(column.key)} className={s.item}>
                  <Checkbox
                    checked={visibleColumns.includes(key)}
                    onChange={(e) => {
                      const check = e.target.checked;
                      setVisibleColumns(prev => {
                        if(check) {return ([...prev, key])}
                          else {return (prev.filter(k => k !== key))}
                      }
                      );
                    }}
                  />
                  <p className={s.label}>{column.label}</p>
                </li>
              );
            })}
          </ul>
        </PopUp>
      }
    </section>
  );
}