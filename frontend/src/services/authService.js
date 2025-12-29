import axios from 'axios'
import { clearRollbarUser } from '../config/rollbar'
import { logInfo, logError } from '../utils/errorLogger'

const API_BASE_URL = '/api/v1'
let interceptorsSetup = false

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password,
    })

    const { token } = response.data
    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('username', username)
      logInfo('Login successful', { username })
    }
    return token
  }
  catch (error) {
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || 'Неверное имя пользователя или пароль'
      const customError = new Error(message)
      customError.skipInterceptor = true
      throw customError
    }
    const message = error.response?.data?.message || 'Ошибка авторизации. Попробуйте позже.'
    throw new Error(message)
  }
}

export const signup = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, {
      username,
      password,
    })

    const { token } = response.data
    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('username', username)
      logInfo('Signup successful', { username })
    }

    return token
  }
  catch (error) {
    logError(error, { username, type: 'signup_error' })
    throw error
  }
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const getUsername = () => {
  return localStorage.getItem('username')
}

export const isAuthenticated = () => {
  return !!getToken()
}

export const logout = () => {
  const username = getUsername()
  clearRollbarUser()
  logInfo('User logged out', { username })
  localStorage.removeItem('token')
  localStorage.removeItem('username')
}

export const setupAxiosInterceptors = (onUnauthorized) => {
  if (interceptorsSetup) return
  interceptorsSetup = true

  axios.interceptors.request.use(
    (config) => {
      const token = getToken()
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    error => Promise.reject(error),
  )

  axios.interceptors.response.use(
    response => response,
    (error) => {
      if (error.config?.url?.includes('/login') && error.response?.status === 401) {
        return Promise.reject(error)
      }

      if (error.response?.status === 401) {
        logout()
        if (onUnauthorized) {
          onUnauthorized()
        }
        else {
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    },
  )
}
