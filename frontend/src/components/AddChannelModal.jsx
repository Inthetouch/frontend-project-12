import { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { createChannel } from '../store/chatSlice';
import { showSuccessToast, showErrorToast } from '../utils/toastService';
import { cleanProfanity } from '../utils/profanityFilter';

function AddChannelModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels } = useSelector((state) => state.chat);
  const inputRef = useRef(null);

  const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required(t('chat.channelModal.add.validation.nameRequired'))
    .min(3, t('chat.channelModal.add.validation.nameTooShort'))
    .max(20, t('chat.channelModal.add.validation.nameTooLong'))
    .test('unique', t('chat.channelModal.add.validation.nameDuplicate'), function (value) {
      if (!value) return true;
      return !channels.some(
        (ch) => ch.name.toLowerCase() === value?.toLowerCase()
      );
    })
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    validateOnBlur: false, 
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const cleanedName = cleanProfanity(values.name);
        
        await dispatch(createChannel({ name: cleanedName })).unwrap();
        
        showSuccessToast('toast.channel.created');
        onClose();
        resetForm();
      } catch (error) {
        console.error('Failed to create channel:', error);
        showErrorToast('toast.channel.createError');
        inputRef.current?.select();
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.channelModal.add.title')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label className="visually-hidden">{t('chat.channelModal.add.name')}</Form.Label>
            <Form.Control
              ref={inputRef}
              type="text"
              name="name"
              placeholder={t('chat.channelModal.add.namePlaceholder') || t('chat.channelModal.add.name')}
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
              {formik.isSubmitting ? t('common.loading') : t('chat.channelModal.add.button')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddChannelModal;