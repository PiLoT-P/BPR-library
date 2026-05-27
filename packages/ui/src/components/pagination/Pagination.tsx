import { CSSProperties, JSX, useCallback } from "react";
import s from './Pagination.module.scss';
import { Button, IconButton } from "../button";

export interface PaginationProps {
  pagination: { skip: number, take: number },
  setPaginations: (pagination: { skip: number, take: number }) => void;
  count: number;
  style?: CSSProperties;
}

export function Pagination({
  count,
  pagination,
  setPaginations,
  style,
}: PaginationProps){
  const totalPages = Math.ceil(count / pagination.take);
  const currentPage = Math.floor(pagination.skip / pagination.take) + 1;

  const renderPageButton = (page: number) => (
    <Button
      key={page}
      variant={page === currentPage ? 'primary' : 'secondary'}
      className={s.btn}
      onClick={() => setPaginations({ skip: (page - 1) * pagination.take, take: pagination.take })}
    >
      {page}
    </Button>
  );

  const renderPages = useCallback((): JSX.Element[] => {
    const pages: JSX.Element[] = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(renderPageButton(i));
      }
      return pages;
    }

    // Блок: початок
    if (currentPage < 5) {
      for (let i = 1; i <= 5; i++) {
        pages.push(renderPageButton(i));
      }
      pages.push(<span key="dots2" className={s.dots}>...</span>);
      pages.push(renderPageButton(totalPages));
      return pages;
    }

    // Блок: кінець
    if (currentPage > totalPages - 5) {
      pages.push(renderPageButton(1));
      pages.push(<span key="dots1" className={s.dots}>...</span>);
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(renderPageButton(i));
      }
      return pages;
    }

    // Блок: середина
    pages.push(renderPageButton(1));
    pages.push(<span key="dots1" className={s.dots}>...</span>);
    for (let i = currentPage - 1; i <= currentPage + 1 && i <= totalPages; i++) {
      pages.push(renderPageButton(i));
    }
    pages.push(<span key="dots2" className={s.dots}>...</span>);
    pages.push(renderPageButton(totalPages));
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className={s.pagination} style={{ ...style }}>
      <IconButton
        icon="arrow-left"
        onClick={() => {setPaginations({ skip: Math.max(pagination.skip - pagination.take, 0), take: pagination.take })}}
        style={{ marginRight: '5px'}}
        disabled={currentPage === 1}
      />
      {renderPages()}
      <IconButton
        icon="arrow-right"
        onClick={() => {setPaginations({ skip: Math.min(pagination.skip + pagination.take, (totalPages - 1) * pagination.take), take: pagination.take })}}
        style={{ marginLeft: '5px'}}
        disabled={currentPage === totalPages}
      />
    </div>
  );
}