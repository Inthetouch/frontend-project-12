import { Link } from 'react-router-dom';
import Header from '../components/Header';

const NotFoundPage = () => {
  return (
    <>
      <Header />
      <div className="not-found-page">
        <h1>404 - Страница не найдена</h1>
        <p>Кажется, вы заблудились.</p>

        <nav>
          <Link to="/">Вернуться на главную</Link>
        </nav>
      </div>
    </>
  );
};

export default NotFoundPage;