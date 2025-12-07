import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { renameChannel } from '../store/chatSlice';
import Modal from './Modal';

function RenameChannelModal({ isOpen, onClose, channel }) {
  const dispatch = useDispatch();
  const { channels, isLoadingChannels } = useSelector((state) => state.chat);

  if (!channel) return null;

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Имя канала должно быть от 3 символов')
      .max(20, 'Имя канала не должно превышать 20 символов')
      .required('Имя канала обязательно')
      .test('unique', 'Канал с таким именем уже существует', (value) => {
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
      onClose();
    } catch (error) {
      console.error('Failed to rename channel:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title="Переименовать канал" onClose={onClose}>
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
                <label htmlFor="rename-channel">Новое имя канала</label>
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
                  {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn--secondary"
                >
                  Отмена
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