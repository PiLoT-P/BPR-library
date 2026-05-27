import { CSSTransition } from 'react-transition-group';
import { CSSProperties, memo, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import s from './ModalBox.module.scss';
import { useModalStore } from '../../store/modals/ModalStore';
import { Loader } from '../loader';
import { IconButton } from '../button';

export interface ModalBoxProps {
  isOpen: boolean;
  handleClose: () => void;
  handleAnimationEnd?: () => void;
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  style?: CSSProperties;
  type?: 'center' | 'side';
  title?: string;
  disabledTitle?: boolean;
  blockBackdrop?: boolean;
  skeleton?: ReactNode;
}

export const ModalBox = ({
  isOpen,
  handleClose,
  handleAnimationEnd,
  children,
  isLoading = false,
  style,
  type = 'side',
  title,
  className,
  disabledTitle = false,
  blockBackdrop = false,
  skeleton,
}: ModalBoxProps) => {
  const [modalId] = useState(() => Math.floor(Math.random() * 1_000_000_000));
  const [isVisibleContent, setIsVisibleContent] = useState(false);

  const nodeRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);

  const {
    modals,
    addModal,
    getModalIndex,
    removeModal,
    isTopModal,
  } = useModalStore();

  useEffect(() => {
    const isScrollBlocked = document.body.classList.contains('no-scroll');

    if (modals.length > 0 && !isScrollBlocked) {
      document.body.classList.add('no-scroll');
    } else if (modals.length === 0 && isScrollBlocked) {
      document.body.classList.remove('no-scroll');
    }
  }, [modals]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isTopModal(modalId)) {
        handleClose();
        event.stopPropagation();
      }
    }

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen, handleClose])

  /* Взаємодія з модалкою */
  useEffect(() => {
    if (isOpen) { addModal(modalId) }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTopModal(modalId)) {
      handleClose();
    }
    e.stopPropagation();
  };

  /* Закриття модалки при демонтуванні компоненту */
  useEffect(() => () => {
    if (getModalIndex(modalId) !== -1) {
      console.log('closed', modalId);
      removeModal(modalId);
    }
  }, [])

  const zIndex = 1000 + (getModalIndex(modalId) * 2);

  const renderChildren = useCallback(() => {
    if (type === 'center') {
      return children;
    } if (isVisibleContent && !isLoading) {
      return children
    }
    return skeleton || <Loader />;
  }, [isVisibleContent, isLoading, children])

  return createPortal(
    <>
      <CSSTransition
        in={isOpen}
        timeout={type === 'side' ? 500 : 500}
        classNames={{
          enter: s.backdropEnter,
          enterActive: s.backdropEnterActive,
          exit: s.backdropExit,
          exitActive: s.backdropExitActive,
        }}
        unmountOnExit
        nodeRef={backdropRef}
        onExited={() => {
          removeModal(modalId);
          if (handleAnimationEnd) {
            handleAnimationEnd()
          }
        }}
      >
        <div
          ref={backdropRef}
          className={s.backdrop}
          style={{ zIndex: zIndex - 1 }}
          onClick={blockBackdrop ? () => {} : handleBackdropClick}
        />
      </CSSTransition>
      <CSSTransition
        in={isOpen}
        timeout={type === 'side' ? 500 : 300}
        classNames={{
          enter: s[`${type}_open-enter`],
          enterActive: s[`${type}_open-enter-active`],
          exit: s[`${type}_open-exit`],
          exitActive: s[`${type}_open-exit-active`],
        }}
        unmountOnExit
        nodeRef={nodeRef}
        onEntered={() => setIsVisibleContent(true)}
        onExit={() => setIsVisibleContent(false)}
      >
        <div
          ref={nodeRef}
          className={`
            ${s.container}
            ${s[type]}
            ${className}
          `}
          style={{
            zIndex,
            ...style,
          }}
        >
          {(type === 'center' && !disabledTitle) && (
            <div className={s.title_block}>
              <h2 className={s.title}>{title}</h2>
              <IconButton
                icon='cancel'
                variant='transparent'
                onClick={handleClose}
                className={s.btn_close}
              />
            </div>
          )}
          {renderChildren()}
          {(type === 'side') && (
            <IconButton
              icon='cancel'
              variant='secondary'
              onClick={handleClose}
              className={s.btn_close}
            />
          )}
        </div>
      </CSSTransition>
    </>,
    document.body,
  );
};