import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { useTranslation } from 'react-i18next'

const NotFoundPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <Header />
      <div className="not-found-page text-center">
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.message')}</p>
        <p>{t('notFound.description')}</p>

        <nav>
          <Link to="/">{t('notFound.link')}</Link>
        </nav>
      </div>
    </>
  )
}

export default NotFoundPage
