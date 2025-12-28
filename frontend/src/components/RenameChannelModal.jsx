import { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { renameChannel } from '../store/chatSlice';
import { showSuccessToast, showErrorToast } from '../utils/toastService';
import { cleanProfanity, isProfane } from '../utils/profanityFilter';

const RenameChannelModal = ({ isOpen, onClose, channel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels } = useSelector((state) => state.chat);
  const inputRef = useRef(null);

  const validationSchema = yup.object({
    name: yup.string()
      .trim()
      .required(t('chat.channelModal.rename.validation.nameRequired'))
      .min(3, t('chat.channelModal.rename.validation.nameTooShort'))
      .max(20, t('chat.channelModal.rename.validation.nameTooLong'))
      .test('unique', t('chat.channelModal.rename.validation.nameDuplicate'), (value) => {
        if (!value || !channel) return true;
        return !channels.some(
          (ch) => ch.name.toLowerCase() === value.toLowerCase()
        );
      })
      .test('profanity', t('chat.channelModal.rename.validation.profanity'), (value) => {
        return !isProfane(value);
      }),
  });

  const formik = useFormik({
    initialValues: {
      name: channel ? channel.name : '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const cleanedName = cleanProfanity(values.name);
        await dispatch(
          renameChannel({ channelId: channel.id, name: cleanedName })
        ).unwrap();
        
        showSuccessToast('toast.channel.renamed');
        onClose();
      } catch (error) {
        console.error('Failed to rename channel:', error);
        showErrorToast('toast.channel.renameError');
        inputRef.current?.select();
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.select();
    }
  }, [isOpen]);

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.channelModal.rename.title')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label className="visually-hidden">{t('chat.channelModal.rename.name')}</Form.Label>
            <Form.Control
              ref={inputRef}
              type="text"
              name="name"
              placeholder={t('chat.channelModal.rename.namePlaceholder') || "Новое имя канала"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              isInvalid={!!formik.errors.name}
              disabled={formik.isSubmitting}
              autoComplete="off"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          
          <div className="d-flex justify-content-end mt-3 gap-2">
            <Button 
                variant="secondary" 
                onClick={onClose} 
                disabled={formik.isSubmitting}
            >
              {t('common.cancel')}
            </Button>
            <Button 
                type="submit" 
                variant="primary" 
                disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? t('common.loading') : t('common.send')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannelModal;