import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createChannel } from '../store/chatSlice';
import Modal from './Modal';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Имя канала должно быть от 3 символов')
    .max(20, 'Имя канала не должно превышать 20 символов')
    .required('Имя канала обязательно')
    .test('unique', 'Канал с таким именем уже существует', function (value) {
      const { channels } = this.options.context;
      return !channels.some(
        (ch) => ch.name.toLowerCase() === value?.toLowerCase()
      );
    }),
});

function AddChannelModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { channels, isLoadingChannels } = useSelector((state) => state.chat);
  const inputRef = useRef(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(createChannel({ name: values.name })).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to create channel:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title="Создать новый канал" onClose={onClose}>
      {({ firstFocusableRef }) => (
        <Formik
          initialValues={{ name: '' }}
          validationSchema={validationSchema.concat(
            Yup.object().shape({
              name: Yup.string().test(
                'unique',
                'Канал с таким именем уже существует',
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
                <label htmlFor="channel-name">Имя канала</label>
                <Field
                  ref={(el) => {
                    firstFocusableRef.current = el;
                    inputRef.current = el;
                  }}
                  type="text"
                  id="channel-name"
                  name="name"
                  placeholder="Введите имя канала"
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
                  {isSubmitting ? 'Создание...' : 'Создать'}
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

export default AddChannelModal;