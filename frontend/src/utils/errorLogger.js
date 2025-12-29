import { captureException, captureMessage } from '../config/rollbar'

export const logCriticalError = (error, context = {}) => {
  console.error('[CRITICAL ERROR]', error, context)
  captureException(error, {
    level: 'critical',
    severity: 'critical',
    ...context,
  })
}

export const logError = (error, context = {}) => {
  console.error('[ERROR]', error, context)
  captureException(error, {
    level: 'error',
    severity: 'error',
    ...context,
  })
}

export const logWarning = (message, context = {}) => {
  console.warn('[WARNING]', message, context)
  captureMessage(message, 'warning', {
    level: 'warning',
    ...context,
  })
}

export const logInfo = (message, context = {}) => {
  console.log('[INFO]', message, context)
  captureMessage(message, 'info', {
    level: 'info',
    ...context,
  })
}

export const logDebug = (message, context = {}) => {
  console.debug('[DEBUG]', message, context)
  captureMessage(message, 'debug', {
    level: 'debug',
    ...context,
  })
}
