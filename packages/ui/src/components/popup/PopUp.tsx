import { createPopper } from "@popperjs/core";
import { CSSProperties, FC, ReactNode, RefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import s from './PopUp.module.scss';

export interface PopUpProps {
  containerRef: RefObject<HTMLDivElement | HTMLButtonElement | null>,
  children: ReactNode,
  handleClose: () => void,
  disabledMinWidth?: boolean,
  style?: CSSProperties
}

export const PopUp: FC<PopUpProps> = ({
  containerRef,
  handleClose,
  children,
  disabledMinWidth = false,
  style,
}) => {
  const [minWidth, setMinWidth] = useState<number>(containerRef.current ?
    containerRef.current.getBoundingClientRect().width : 0);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !popoverRef.current) return;

    const popperInstance = createPopper(containerRef.current, popoverRef.current, {
      placement: 'bottom-start', // Випадає вниз
      modifiers: [
        { name: 'flip', options: { fallbackPlacements: ['top-start'] } }, // Міняє позицію, якщо не вміщається
        { name: 'preventOverflow', options: { boundary: 'viewport' } }, // Запобігає виходу за межі екрану
      ],
    });

    const observer = new ResizeObserver(() => {
      setMinWidth(containerRef.current!.getBoundingClientRect().width);
      popperInstance.update(); // Оновлюємо позицію поппера
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      popperInstance.destroy();
    };
  }, [containerRef.current]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClose, containerRef.current]);

  return createPortal(
    <div
      ref={popoverRef}
      className={s.container}
      style={{
        ...style,
        minWidth: !disabledMinWidth ? `${minWidth}px` : 'unset',
      }}
      tabIndex={-1}
    >
      {children}
    </div>,
    document.body,
  );
}