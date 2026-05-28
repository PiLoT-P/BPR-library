import { useRef, useState } from 'react';
import s from './DataTable.module.scss';
import { useDataTablePreferences } from './hook/useDataTablePreferences';
import { IconButton } from '../button';
import { PopUp } from '../popup';
import { Checkbox } from '../checkbox';
import { Icon } from '../icon-display';

export interface Column<T> {
  key: keyof T & string;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: number | string;
}

export interface IColumnSort<T> {
  key: keyof T & string;
  direction: 'asc' | 'desc';
}

interface BaseDataTableProps<T>{
  tableId: string,
  columns: Column<T>[];
  data: (T & { id: number })[];
  actions?: (row: T, close?: () => void) => React.ReactNode;
  sortedBy?: IColumnSort<T>;
  handleSort?: (data?: IColumnSort<T>) => void;
  useContext?: boolean,
}

export type DataTableProps<T> = BaseDataTableProps<T>

export function DataTable<T>({
  tableId,
  columns,
  data,
  actions,
  sortedBy,
  handleSort,
  useContext = false,
}: DataTableProps<T>){
  const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false);

  const [selectedElement, setSelectedElement] = useState<{
    position: { x: number; y: number }
    element: T,
  }>();

  const {
    visibleColumns,
    setVisibleColumns,
  } = useDataTablePreferences(tableId, columns.map(c => String(c.key)));
  
  const settingsContainerRef = useRef<HTMLDivElement | null>(null);

  const filteredColumns = columns.filter(col =>
    visibleColumns.includes(String(col.key)),
  );

  const handleContextMenu = (e: React.MouseEvent<HTMLTableRowElement>, row: T) => {
    if(actions && useContext){
      e.preventDefault();
      e.stopPropagation();
      setSelectedElement({ position: { x: e.clientX, y: e.clientY }, element: row });
    }
  };

  const handleSortClick = (col: Column<T>) => {
    if(handleSort){
      if(sortedBy?.key === col.key){
        const newDirection = sortedBy.direction === 'asc' ? 'desc' : 'asc';
        handleSort({ key: col.key, direction: newDirection });
      } else {
        handleSort({ key: col.key, direction: 'asc' });
      }
    }
  }

  return (
    <>
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
                <div className={`${s.title} ${!!handleSort ? s.sortable : ''}`} onClick={() => handleSortClick(col)}>
                  <p className={s.label}>{col.label}</p>
                  {sortedBy?.key === col.key && (
                    <Icon
                      width={12}
                      height={12}
                      name={sortedBy.direction === 'asc' ? 'arrow-up' : 'arrow-down'}
                    />
                  )}
                </div>
              </th>
            ))}
            {(actions && !useContext) &&
              <th style={{ width: '0' }}>
                <div className={s.title}>
                  Дії
                </div>
              </th>
            }
          </tr>
        </thead>
        <tbody className={s.table_body}>
          {data.map(row => (
            <tr 
              key={row.id} 
              onContextMenu={(e) => useContext ? handleContextMenu(e, row) : null}
              className={`${(actions && useContext) ? s.hover_row : ''}`}
            >
              <td style={{ width: '40px'}} />
              {filteredColumns.map(col => (
                <td key={String(col.key)} style={{ width: col.width }}>
                  <div className={s.content}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '-')}
                  </div>
                </td>
              ))}
              {(actions && !useContext) && (
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
      {selectedElement &&
        <PopUp
          handleClose={() => setSelectedElement(undefined)}
          x={selectedElement.position.x}
          y={selectedElement.position.y}
        >
          {actions && actions(selectedElement.element, () => {setSelectedElement(undefined)})}
        </PopUp>
      }
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
    </>
  );
}