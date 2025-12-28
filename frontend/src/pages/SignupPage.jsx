import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form, Card, Container, Row, Col, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { signup } from '../services/authService.js';
import Header from '../components/Header';
import { showSuccessToast, showErrorToast } from '../utils/toastService';
import avatarImage from '../assets/avatar_2.jpg';

function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [registrationError, setRegistrationError] = useState(false);

  const validationSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .required(t('auth.validation.usernameRequired'))
    .min(3,  t('auth.validation.usernameTooShort'))
    .max(20, t('auth.validation.usernameTooLong')),
  password: Yup.string()
    .trim()
    .required(t('auth.validation.passwordRequired'))
    .min(6, t('auth.validation.passwordTooShort')),
  confirmPassword: Yup.string()
    .test('password-match', t('auth.validation.passwordMismatch'), function(value) {
        return this.parent.password === value;
      }),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setRegistrationError(false);
      try {
        await signup(values.username, values.password);
        showSuccessToast(t('toast.auth.signupSuccess'));
        navigate('/');
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 409) {
          setRegistrationError(true);
          inputRef.current?.select();
        } else {
          showErrorToast(t('toast.auth.signupError'));
        }
      }
    },
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="d-flex flex-column h-100 bg-light">
      <Header />

      <Container fluid className="h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col xs={12} md={8} xxl={6}>
            <Card className="shadow-sm">
              <Card.Body className="row p-5">
                <Col md={6} className="d-flex align-items-center justify-content-center">
                  <img
                    src={avatarImage}
                    alt={t('auth.signup.title')}
                    className="rounded-circle"
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                </Col>

                <Col md={6}>
                  <Form onSubmit={formik.handleSubmit}>
                    <h1 className="text-center mb-4">{t('auth.signup.title')}</h1>

                    <FloatingLabel
                      controlId="username"
                      label={t('auth.signup.username')}
                      className="mb-3"
                    >
                      <Form.Control
                        ref={inputRef}
                        type="text"
                        name="username"
                        placeholder={t('auth.signup.username')}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        isInvalid={
                          (formik.touched.username && !!formik.errors.username) || registrationError
                        }
                        autoComplete="username"
                      />
                      <Form.Control.Feedback type="invalid" tooltip placement="right">
                        {registrationError 
                            ? t('auth.validation.userAlreadyExists') 
                            : formik.errors.username}
                      </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel
                      controlId="password"
                      label={t('auth.signup.password')}
                      className="mb-3"
                    >
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder={t('auth.signup.password')}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        isInvalid={formik.touched.password && !!formik.errors.password}
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback type="invalid" tooltip>
                        {formik.errors.password}
                      </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel
                      controlId="confirmPassword"
                      label={t('auth.signup.passwordConfirm')}
                      className="mb-4"
                    >
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder={t('auth.signup.passwordConfirm')}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                        isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback type="invalid" tooltip>
                        {formik.errors.confirmPassword}
                      </Form.Control.Feedback>
                    </FloatingLabel>

                    <Button 
                        type="submit" 
                        variant="outline-primary" 
                        className="w-100 mb-3"
                        disabled={formik.isSubmitting}
                    >
                      {t('auth.signup.button')}
                    </Button>
                  </Form>
                </Col>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SignupPage;