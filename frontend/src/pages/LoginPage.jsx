import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import Header from '../components/Header';
import './LoginPage.css';

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Имя должно содержать минимум 3 символа")
    .max(20, "Имя должно содержать максимум 20 символов")
    .required("Имя пользователя обязательно"),
  password: Yup.string()
    .min(5, "Пароль должен содержать минимум 5 символов")
    .required("Пароль обязателен"),
});

function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const handleSubmit = async (values, {setSubmitting}) => {
    setServerError(null);
    try {
      await login(values.username, values.password);
      navigate("/");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Вход</h1>
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
                <label htmlFor="username">Имя пользователя</label>
                <Field 
                  type="text" 
                  name="username"
                  id="username"
                  placeholder="Введите имя пользователя"
                  className={`form-input ${
                    errors.username && touched.username ? 'input-error' : ''
                  }`}
                />
                <ErrorMessage name="username" component="div" className="error-message"/>
              </div>
              <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <Field 
                  type="password" 
                  name="password"
                  id="password"
                  placeholder="Введите пароль"
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
                {isSubmitting ? 'Загрузка...' : 'Войти'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="login-hint">
          <p>Для тестирования используйте:</p>
          <p>Логин: <strong>admin</strong></p>
          <p>Пароль: <strong>admin</strong></p>
        </div>

        <nav className="login-nav">
          <Link to="/">Вернуться в чат</Link>
        </nav>

        <div className="login-footer">
          <p>
            Нет аккаунта?{' '}
            <Link to="/signup" className="login-link">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
};

export default LoginPage;