import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import './LoginPage.css';

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Имя должно содержать минимум 3 символа")
    .max(20, "Имя должно содержать максимум 20 символов")
    .required("Имя пользователя обязательно"),
  password: Yup.string()
    .min(6, "Пароль должен содержать минимум 6 символов")
    .required("Пароль обязателен"),
});

const LoginPage = () => {
  const handleSubmit = (values, {setSubmitting}) => {
    console.log("Данные формы:", values);
    setSubmitting(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Вход</h1>
        
        <Formik
          initialValues={{ 
            username: "", 
            password: "" 
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="form-group">
                <label htmlFor="username">Имя пользователя</label>
                <Field 
                  type="text" 
                  name="username"
                  id="username"
                  placeholder="Введите имя пользователя"
                  className="form-input"
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
                  className="form-input"
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
        <nav className="login-nav">
          <Link to="/">Вернуться в чат</Link>
        </nav>
      </div>
    </div>
  )
};

export default LoginPage;