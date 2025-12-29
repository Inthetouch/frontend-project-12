import { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import { Button, Form, Card, Container, Row, Col, FloatingLabel } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { login } from '../services/authService.js'
import { showSuccessToast } from '../utils/toastService'
import { setRollbarUser } from '../config/rollbar'
import { logInfo, logError } from '../utils/errorLogger'
import Header from '../components/Header.jsx'
import avatarImage from '../assets/avatar_1.jpg'

function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [authFailed, setAuthFailed] = useState(false)

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .trim()
      .required(t('auth.validation.usernameRequired')),
    password: Yup.string()
      .trim()
      .required(t('auth.validation.passwordRequired')),
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setAuthFailed(false)
      try {
        await login(values.username, values.password)
        setRollbarUser(values.username)
        logInfo('User logged in', { username: values.username })
        showSuccessToast('toast.auth.loginSuccess')
        navigate('/')
      }
      catch (error) {
        setAuthFailed(true)
        inputRef.current?.select()
        logError(error, { username: values.username, type: 'login_error' })
      }
    },
  })

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

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
                    alt={t('auth.login.title')}
                    className="rounded-circle"
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                </Col>

                <Col md={6}>
                  <Form onSubmit={formik.handleSubmit}>
                    <h1 className="text-center mb-4">{t('auth.login.title')}</h1>

                    <FloatingLabel
                      controlId="username"
                      label={t('auth.login.username')}
                      className="mb-3"
                    >
                      <Form.Control
                        ref={inputRef}
                        type="text"
                        name="username"
                        placeholder={t('auth.login.username')}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        isInvalid={authFailed || (formik.touched.username && !!formik.errors.username)}
                        autoComplete="username"
                      />
                      <Form.Control.Feedback type="invalid" tooltip>
                        {formik.errors.username}
                      </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel
                      controlId="password"
                      label={t('auth.login.password')}
                      className="mb-4"
                    >
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder={t('auth.login.password')}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        isInvalid={authFailed || (formik.touched.password && !!formik.errors.password)}
                        autoComplete="current-password"
                      />
                      <Form.Control.Feedback type="invalid" tooltip>
                        {authFailed
                          ? t('auth.validation.authError')
                          : formik.errors.password}
                      </Form.Control.Feedback>
                    </FloatingLabel>

                    <Button
                      type="submit"
                      variant="outline-primary"
                      className="w-100 mb-3"
                      disabled={formik.isSubmitting}
                    >
                      {t('auth.login.button')}
                    </Button>
                  </Form>
                </Col>
              </Card.Body>

              <Card.Footer className="p-4 border-top-0 bg-light">
                <div className="d-flex flex-column align-items-center">
                  <span className="small mb-2">
                    {t('auth.login.noAccount')}
                    {' '}
                    <Link to="/signup">{t('auth.login.signup')}</Link>
                  </span>
                </div>
              </Card.Footer>

            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
};

export default LoginPage
