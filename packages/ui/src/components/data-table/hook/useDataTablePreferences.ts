import { useEffect, useState } from "react";

const STORAGE_KEY = 'datatable:preferences';

type TablePrefs = {
  visibleColumns: string[];
};

type AllPrefs = Record<string, TablePrefs>;

export function useDataTablePreferences(
  tableId: string,
  defaultColumns: string[],
){
  const read = ():AllPrefs => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  const write = (data: AllPrefs) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  const [visibleColumns, setVisibleColumnsState] = useState<string[]>(() => {
    return read()[tableId]?.visibleColumns ?? defaultColumns;
  });

  useEffect(() => {
    const all = read();
    write({
      ...all,
      [tableId]: { visibleColumns },
    });
  }, [tableId, visibleColumns]);

  return {
    visibleColumns: visibleColumns,
    setVisibleColumns: setVisibleColumnsState,
  };
}