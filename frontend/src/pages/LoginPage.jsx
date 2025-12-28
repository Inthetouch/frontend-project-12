import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { showSuccessToast, showErrorToast } from '../utils/toastService';
import { setRollbarUser } from '../config/rollbar';
import { logInfo, logError } from '../utils/errorLogger';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [serverError, setServerError] = useState(null);

  const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, t('auth.validation.usernameTooShort'))
    .max(20, t('auth.validation.usernameTooLong'))
    .required(t('auth.validation.usernameRequired')),
  password: Yup.string()
    .min(5, t('auth.validation.passwordTooShort'))
    .required(t('auth.validation.passwordRequired')),
  });

  const handleSubmit = async (values, {setSubmitting}) => {
    setServerError(null);
    try {
      await login(values.username, values.password);
      setRollbarUser(values.username, values.username);
      logInfo('User logged in', { username: values.username });
      showSuccessToast('toast.auth.loginSuccess');
      navigate("/");
    } catch (error) {
      setServerError(error.message);
      logError(error, { 
        username: values.username,
        type: 'login_error',
      });
      showErrorToast('toast.auth.loginError');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>{t('auth.login.title')}</h1>
        {serverError && <div className="alert alert-error">{serverError}</div>}
        <Formik
          initialValues={{ 
            username: "", 
            password: "" 
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="login-form">
              <div className="form-group">
                <label htmlFor="username">{t('auth.login.username')}</label>
                <Field 
                  type="text" 
                  name="username"
                  id="username"
                  placeholder={t('auth.login.usernamePlaceholder')}
                  className={`form-input ${
                    errors.username && touched.username ? 'input-error' : ''
                  }`}
                />
                <ErrorMessage name="username" component="div" className="error-message"/>
              </div>
              <div className="form-group">
                <label htmlFor="password">{t('auth.login.password')}</label>
                <Field 
                  type="password" 
                  name="password"
                  id="password"
                  placeholder={t('auth.login.passwordPlaceholder')}
                  className={`form-input ${
                    errors.password && touched.password ? 'input-error' : ''
                  }`}
                />
                <ErrorMessage name="password" component="div" className="error-message"/>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? t('common.loading') : t('auth.login.button')}
              </button>
            </Form>
          )}
        </Formik>

        <div className="login-hint">
          <p>{t('auth.login.testCredentials')}</p>
          <p>{t('auth.login.testLogin')} <strong>admin</strong></p>
          <p>{t('auth.login.testPassword')} <strong>admin</strong></p>
        </div>

        <nav className="login-nav">
          <Link to="/">{t('notFound.link')}</Link>
        </nav>

        <div className="login-footer">
          <p>
            {t('auth.login.noAccount')}{' '}
            <Link to="/signup" className="login-link">
              {t('auth.login.signup')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
};

export default LoginPage;