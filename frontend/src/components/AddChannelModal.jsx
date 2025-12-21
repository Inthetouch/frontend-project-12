import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { createChannel } from '../store/chatSlice';
import { showSuccessToast, showErrorToast } from '../utils/toastService';
import { cleanProfanity, isProfane } from '../utils/profanityFilter';
import Modal from './Modal';

function AddChannelModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { channels, isLoadingChannels } = useSelector((state) => state.chat);
  const inputRef = useRef(null);

  const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, t('chat.channelModal.add.validation.nameTooShort'))
    .max(20, t('chat.channelModal.add.validation.nameTooLong'))
    .required(t('chat.channelModal.add.validation.nameRequired'))
    .test('unique', t('chat.channelModal.add.validation.nameDuplicate'), function (value) {
      const { channels } = this.options.context;
      return !channels.some(
        (ch) => ch.name.toLowerCase() === value?.toLowerCase()
      );
    })
    .test('profanity', t('chat.channelModal.add.validation.profanity'), (value) => {
        return !isProfane(value);
      }),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const cleanedName = cleanProfanity(values.name);
      await dispatch(createChannel({ name: cleanedName })).unwrap();
      showSuccessToast('toast.channel.created');
      onClose();
    } catch (error) {
      console.error('Failed to create channel:', error);
      showErrorToast('toast.channel.createError');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title={t('chat.channelModal.add.title')} onClose={onClose}>
      {({ firstFocusableRef }) => (
        <Formik
          initialValues={{ name: '' }}
          validationSchema={validationSchema.concat(
            Yup.object().shape({
              name: Yup.string().test(
                'unique',
                t('chat.channelModal.add.validation.nameDuplicate'),
                function (value) {
                  return !channels.some(
                    (ch) => ch.name.toLowerCase() === value?.toLowerCase()
                  );
                }
              ),
            })
          )}
          validationContext={{ channels }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="channel-form">
              <div className="form-group">
                <label htmlFor="channel-name">{t('chat.channelModal.add.name')}</label>
                <Field
                  ref={(el) => {
                    firstFocusableRef.current = el;
                    inputRef.current = el;
                  }}
                  type="text"
                  id="channel-name"
                  name="name"
                  placeholder={t('chat.channelModal.add.namePlaceholder')}
                  className={`form-input ${
                    errors.name && touched.name ? 'input-error' : ''
                  }`}
                  disabled={isSubmitting || isLoadingChannels}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingChannels}
                  className="btn btn--primary"
                >
                  {isSubmitting ? t('common.loading') : t('chat.channelModal.add.button')}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn--secondary"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  );
}

export default AddChannelModal;