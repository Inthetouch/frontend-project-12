import Rollbar from 'rollbar';

export const initializeRollbar = (environment = 'development') => {
  const rollbarToken = import.meta.env.VITE_ROLLBAR_TOKEN;

  if (rollbarToken) {
    window.Rollbar = new Rollbar({
      accessToken: rollbarToken,
      environment: environment,
      enabled: true,
      captureUncaught: true,
      captureUnhandledRejections: true,
      hostSafeList: ['localhost'],
      payload: {
        environment: environment,
        client: {
          javascript: {
            source_map_enabled: true,
            code_version: '1.0.0',
          },
        },
      },
      ignoredMessages: [
        'Script error',
        'Non-Error promise rejection captured',
      ],
    });
    console.log('✅ Rollbar initialized for', environment);
  } else {
    console.log('⚠️ Rollbar disabled (no VITE_ROLLBAR_TOKEN)')
    window.Rollbar = null;
  }
};

export const captureMessage = (message, level = 'info', extra = {}) => {
  try {
    if (window.Rollbar) {
      switch (level) {
        case 'critical':
          window.Rollbar.critical(message, extra);
          break;
        case 'error':
          window.Rollbar.error(message, extra);
          break;
        case 'warning':
          window.Rollbar.warning(message, extra);
          break;
        case 'info':
          window.Rollbar.info(message, extra);
          break;
        case 'debug':
          window.Rollbar.debug(message, extra);
          break;
        default:
          window.Rollbar.info(message, extra);
      }
    } else {
      console.log(`[Rollbar - ${level.toUpperCase()}]`, message, extra);
    }
  } catch (error) {
    console.error('[Rollbar captureMessage error]', error);
  }
};

export const captureException = (error, context = {}) => {
  try {
    if (window.Rollbar) {
      window.Rollbar.error(error, context);
    } else {
      console.error('[Rollbar ERROR]', error, context);
    }
  } catch (err) {
    console.error('[Rollbar captureException error]', err);
  }
};

export const setRollbarUser = (userId, username, email = null) => {
  try {
    if (window.Rollbar) {
      window.Rollbar.configure({
        payload: {
          person: {
            id: userId,
            username: username,
            email: email,
          },
        },
      });
      console.log('✅ Rollbar user set:', username);
    }
  } catch (error) {
    console.error('[Rollbar setRollbarUser error]', error);
  }
};

export const clearRollbarUser = () => {
  try {
    if (window.Rollbar) {
      window.Rollbar.configure({
        payload: {
          person: null,
        },
      });
      console.log('✅ Rollbar user cleared');
    }
  } catch (error) {
    console.error('[Rollbar clearRollbarUser error]', error);
  }
};

export default window.Rollbar;