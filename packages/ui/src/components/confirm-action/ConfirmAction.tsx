import { Button } from '../button';
import { Loader } from '../loader';
import { ModalBox } from '../modal-box';
import s from './ConfirmAction.module.scss';

export interface ConfirmActionProps{
  isOpen: boolean,
  message?: string,
  isLoading?: boolean,
  handleClose: () => void,
  handleConfirmAction: () => void,
}

export function ConfirmAction({
  isOpen,
  message = 'Ви дійсно бажате виконати цю дію?',
  isLoading = false,
  handleClose,
  handleConfirmAction,
}: ConfirmActionProps){
  return (
    <ModalBox
      isOpen={isOpen}
      handleClose={handleClose}
      title='Підтвердження дії'
      type='center'
      style={{
        minHeight: 'unset'
      }}
    >
      {isLoading && <Loader/>}
      <div className={s.container}>
        <p className={s.message}>{message}</p>
        <div className={s.actions_block}>
          <Button
            onClick={handleConfirmAction}
            disabled={isLoading}
            className={s.confirm_btn}
          >
            Підтвердити
          </Button>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            className={s.cancel_btn}
          >
            Скасувати
          </Button>
        </div>
      </div>
    </ModalBox>
  );
}