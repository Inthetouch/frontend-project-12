import { useDispatch, useSelector } from 'react-redux';
import { deleteChannel } from '../store/chatSlice';
import Modal from './Modal';

function DeleteChannelModal({ isOpen, onClose, channel }) {
  const dispatch = useDispatch();
  const { isLoadingChannels } = useSelector((state) => state.chat);

  if (!channel) return null;

  const handleConfirm = async () => {
    try {
      await dispatch(deleteChannel({ channelId: channel.id })).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to delete channel:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} title="Удалить канал" onClose={onClose}>
      <div className="delete-confirm">
        <p className="delete-confirm__message">
          Вы уверены, что хотите удалить канал <strong>#{channel.name}</strong>?
        </p>
        <p className="delete-confirm__warning">
          Это действие необратимо. Все сообщения в этом канале будут удалены.
        </p>

        <div className="delete-confirm__actions">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoadingChannels}
            className="btn btn--danger"
          >
            {isLoadingChannels ? 'Удаление...' : 'Удалить'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoadingChannels}
            className="btn btn--secondary"
          >
            Отмена
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteChannelModal;
