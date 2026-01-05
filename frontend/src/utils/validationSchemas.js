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
    .min(3, t('auth.validation.usernameTooShort'))
    .max(20, t('auth.validation.usernameTooLong'))
    .required(t('auth.validation.usernameRequired')),
  password: Yup.string()
    .trim()
    .min(6, t('auth.validation.passwordTooShort'))
    .required(t('auth.validation.passwordRequired')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], t('auth.validation.passwordMismatch'))
    .required(t('auth.validation.passwordRequired')),
})

export const getChannelSchema = (channels, t) => Yup.object().shape({
  name: Yup.string()
    .trim()
    .required(t('chat.channelModal.add.validation.nameRequired'))
    .min(3, t('chat.channelModal.add.validation.nameTooShort'))
    .max(20, t('chat.channelModal.add.validation.nameTooLong'))
    .notOneOf(channels, t('chat.channelModal.add.validation.nameDuplicate')),
})
