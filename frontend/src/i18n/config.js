import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from '../locales/ru.json'

export const initializeI18n = async () => {
  await i18next
    .use(initReactI18next)
    .init({
      resources: {
        ru: {
          translation: ru,
        },
      },
      lng: 'ru',
      fallbackLng: 'ru',
      ns: ['translation'],
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    })
  return i18next
}

export default i18next
