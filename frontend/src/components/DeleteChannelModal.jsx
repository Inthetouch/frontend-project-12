import { useDispatch, useSelector } from 'react-redux';
import { deleteChannel } from '../store/chatSlice';
import { useTranslation } from 'react-i18next';
import { showSuccessToast, showErrorToast } from '../utils/toastService';
import Modal from './Modal';

function DeleteChannelModal({ isOpen, onClose, channel }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isLoadingChannels } = useSelector((state) => state.chat);

  if (!channel) return null;

  const handleConfirm = async () => {
    try {
      await dispatch(deleteChannel({ channelId: channel.id })).unwrap();
      showSuccessToast('toast.channel.deleted');
      onClose();
    } catch (error) {
      console.error('Failed to delete channel:', error);
      showErrorToast('toast.channel.deleteError');
    }
  };

  return (
    <Modal isOpen={isOpen} title={t('chat.channelModal.delete.title')} onClose={onClose}>
      <div className="delete-confirm">
        <p className="delete-confirm__message">
          {t('chat.channelModal.delete.message', { name: `#${channel.name}` })}
        </p>
        <p className="delete-confirm__warning">
          {t('chat.channelModal.delete.warning')}
        </p>

        <div className="delete-confirm__actions">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoadingChannels}
            className="btn btn--danger"
          >
            {isLoadingChannels ? t('common.loading') : t('common.delete')}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoadingChannels}
            className="btn btn--secondary"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteChannelModal;
