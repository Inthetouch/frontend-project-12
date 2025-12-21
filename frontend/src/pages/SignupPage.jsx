import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signup } from '../services/authService';
import Header from '../components/Header';

function SignupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [serverError, setServerError] = useState(null);

  const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3,  t('auth.validation.usernameTooShort'))
    .max(20, t('auth.validation.usernameTooLong'))
    .required(t('auth.validation.usernameRequired')),
  password: Yup.string()
    .min(6, t('auth.validation.passwordTooShort'))
    .required(t('auth.validation.passwordRequired')),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], t('auth.validation.passwordMismatch'))
    .required(t('auth.validation.passwordConfirmRequired')),
  });

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
          <h1>{t('auth.signup.title')}</h1>

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
                  <label htmlFor="username">{t('auth.signup.username')}</label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    placeholder={t('auth.signup.usernamePlaceholder')}
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
                  <label htmlFor="password">{t('auth.signup.password')}</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder={t('auth.signup.passwordPlaceholder')}
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
                    {t('auth.signup.passwordConfirm')}
                  </label>
                  <Field
                    type="password"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    placeholder={t('auth.signup.passwordConfirmPlaceholder')}
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
                  {isSubmitting ? t('common.loading') : t('auth.signup.button')}
                </button>
              </Form>
            )}
          </Formik>

          <div className="signup-footer">
            <p>
              {t('auth.signup.hasAccount')}{' '}
              <Link to="/login" className="signup-link">
                {t('auth.signup.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupPage;