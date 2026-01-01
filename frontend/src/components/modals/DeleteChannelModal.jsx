import { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { deleteChannel } from '../../store/chatSlice'
import { useTranslation } from 'react-i18next'
import { showSuccessToast, showErrorToast } from '../../utils/toastService'

function DeleteChannelModal({ isOpen, onClose, channel }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!channel) return
    setLoading(true)
    try {
      await dispatch(deleteChannel({ channelId: channel.id })).unwrap()
      showSuccessToast('toast.channel.deleted')
      onClose()
    }
    catch (error) {
      console.error('Failed to delete channel:', error)
      showErrorToast('toast.channel.deleteError')
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.channelModal.delete.title')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">
          {t('chat.channelModal.delete.message')}
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          {t('common.cancel')}
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? t('common.loading') : t('chat.channelModal.delete.menu') || t('common.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteChannelModal
