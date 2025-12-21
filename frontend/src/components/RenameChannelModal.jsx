import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { renameChannel } from '../store/chatSlice';
import { showSuccessToast, showErrorToast } from '../utils/toastService';
import Modal from './Modal';

function RenameChannelModal({ isOpen, onClose, channel }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { channels, isLoadingChannels } = useSelector((state) => state.chat);

  if (!channel) return null;

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('chat.channelModal.rename.validation.nameTooShort'))
      .max(20, t('chat.channelModal.rename.validation.nameTooLong'))
      .required(t('chat.channelModal.rename.validation.nameRequired'))
      .test('unique', t('chat.channelModal.rename.validation.nameDuplicate'), (value) => {
        if (!value) return true;
        return !channels.some(
          (ch) =>
            ch.name?.toLowerCase() === value?.toLowerCase() &&
            ch.id !== channel.id
        );
      }),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(
        renameChannel({ channelId: channel.id, name: values.name })
      ).unwrap();
      showSuccessToast('toast.channel.renamed');
      onClose();
    } catch (error) {
      console.error('Failed to rename channel:', error);
      showErrorToast('toast.channel.renameError');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title={t('chat.channelModal.rename.title')} onClose={onClose}>
      {({ firstFocusableRef }) => (
        <Formik
          initialValues={{ name: channel.name || '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="channel-form">
              <div className="form-group">
                <label htmlFor="rename-channel">{t('chat.channelModal.rename.name')}</label>
                <Field
                  ref={firstFocusableRef}
                  type="text"
                  id="rename-channel"
                  name="name"
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
                  {isSubmitting ? t('common.loading') : t('common.save')}
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

export default RenameChannelModal;