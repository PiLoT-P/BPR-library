import { createPopper, VirtualElement } from "@popperjs/core";
import { CSSProperties, ReactNode, RefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import s from './PopUp.module.scss';

export interface PopUpProps {
  containerRef?: RefObject<HTMLDivElement | HTMLButtonElement | null>,
  children: ReactNode,
  handleClose: () => void,
  disabledMinWidth?: boolean,
  x?: number;
  y?: number;
  style?: CSSProperties;
}

export function PopUp ({
  containerRef,
  handleClose,
  children,
  disabledMinWidth = false,
  x,
  y,
  style,
}: PopUpProps){
  const [minWidth, setMinWidth] = useState<number>(containerRef?.current ?
    containerRef.current.getBoundingClientRect().width : 0);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let popperInstance: ReturnType<typeof createPopper> | null = null;
    let observer: ResizeObserver | null = null;

    // Якщо x та y передані — створюємо віртуальний reference для Popper
    if (typeof x === 'number' && typeof y === 'number' && popoverRef.current) {
      const virtualReference: VirtualElement = {
        getBoundingClientRect: () => ({
          x,
          y,
          left: x,
          top: y,
          right: x,
          bottom: y,
          width: 0,
          height: 0,
          toJSON: () => {},
        }),
        contextElement: popoverRef.current,
      };
      popperInstance = createPopper(virtualReference, popoverRef.current, {
        placement: 'bottom-start',
        modifiers: [
          { name: 'flip', options: { fallbackPlacements: ['top-start'] } },
          { name: 'preventOverflow', options: { boundary: 'viewport' } },
        ],
      });
    } else if (containerRef?.current && popoverRef.current) {
      popperInstance = createPopper(containerRef.current, popoverRef.current, {
        placement: 'bottom-start',
        modifiers: [
          { name: 'flip', options: { fallbackPlacements: ['top-start'] } },
          { name: 'preventOverflow', options: { boundary: 'viewport' } },
        ],
      });
      observer = new ResizeObserver(() => {
        setMinWidth(containerRef.current!.getBoundingClientRect().width);
        popperInstance!.update();
      });
      observer.observe(containerRef.current);
    }

    return () => {
      if (observer && containerRef?.current) observer.disconnect();
      if (popperInstance) popperInstance.destroy();
    };
  }, [containerRef?.current, x, y]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        // Якщо containerRef є, перевіряємо і його
        if (containerRef?.current) {
          if (!containerRef.current.contains(event.target as Node)) {
            handleClose();
          }
        } else {
          // Якщо containerRef немає — закриваємо одразу
          handleClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClose, containerRef?.current]);

  return createPortal(
    <div
      ref={popoverRef}
      className={s.container}
      style={typeof x === 'number' && typeof y === 'number'
        ? { minWidth: 'unset', position: 'fixed', ...style } // Popper сам керує left/top
        : { minWidth: !disabledMinWidth ? `${minWidth}px` : 'unset', ...style }
      }
      tabIndex={-1}
    >
      {children}
    </div>,
    document.body,
  );
}