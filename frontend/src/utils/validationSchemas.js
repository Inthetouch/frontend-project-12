import * as Yup from 'yup'

export const getLoginSchema = t => Yup.object().shape({
  username: Yup.string()
    .trim()
    .required(t('auth.validation.usernameRequired')),
  password: Yup.string()
    .trim()
    .required(t('auth.validation.passwordRequired')),
})

export const getSignupSchema = t => Yup.object().shape({
  username: Yup.string()
    .trim()
    .min(3, t('auth.validation.usernameMin'))
    .max(20, t('auth.validation.usernameMax'))
    .required(t('auth.validation.usernameRequired')),
  password: Yup.string()
    .trim()
    .min(6, t('auth.validation.passwordMin'))
    .required(t('auth.validation.passwordRequired')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], t('auth.validation.passwordsMustMatch'))
    .required(t('auth.validation.confirmPasswordRequired')),
})

export const getChannelSchema = (channels, t) => Yup.object().shape({
  name: Yup.string()
    .trim()
    .required(t('channels.validation.required'))
    .min(3, t('channels.validation.min'))
    .max(20, t('channels.validation.max'))
    .notOneOf(channels, t('channels.validation.unique')),
})
