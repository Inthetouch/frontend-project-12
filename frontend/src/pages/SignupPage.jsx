import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';
import Header from '../components/Header';

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Имя должно содержать минимум 3 символа")
    .max(20, "Имя не должно превышать 20 символов")
    .required("Имя пользователя обязательно"),
  password: Yup.string()
    .min(6, "Пароль должен содержать минимум 6 символов")
    .required("Пароль обязателен"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], "Пароли должны совпадать")
    .required("Подтверждение пароля обязательно"),
});

function SignupPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError(null);

    try {
      await signup(values.username, values.password);
      navigate('/');
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="signup-page">
        <div className="signup-container">
          <h1>Регистрация</h1>

          {serverError && (
            <div className="alert alert-error">
              {serverError}
            </div>
          )}

          <Formik
            initialValues={{
              username: '',
              password: '',
              passwordConfirm: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="signup-form">
                <div className="form-group">
                  <label htmlFor="username">[translate:Имя пользователя]</label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    placeholder="[translate:Введите имя пользователя]"
                    className={`form-input ${
                      errors.username && touched.username ? 'input-error' : ''
                    }`}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">[translate:Пароль]</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="[translate:Введите пароль]"
                    className={`form-input ${
                      errors.password && touched.password ? 'input-error' : ''
                    }`}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="passwordConfirm">
                    [translate:Подтвердите пароль]
                  </label>
                  <Field
                    type="password"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    placeholder="[translate:Повторите пароль]"
                    className={`form-input ${
                      errors.passwordConfirm && touched.passwordConfirm
                        ? 'input-error'
                        : ''
                    }`}
                  />
                  <ErrorMessage
                    name="passwordConfirm"
                    component="div"
                    className="error-message"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? '[translate:Регистрация...]' : '[translate:Зарегистрироваться]'}
                </button>
              </Form>
            )}
          </Formik>

          <div className="signup-footer">
            <p>
              [translate:Уже есть аккаунт?]{' '}
              <Link to="/login" className="signup-link">
                [translate:Войти]
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupPage;