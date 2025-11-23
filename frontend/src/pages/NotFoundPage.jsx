import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1>404 - Страница не найдена</h1>
      <p>Кажется, вы заблудились.</p>

      <nav>
        <Link to="/">Вернуться на главную</Link>
      </nav>
    </div>
  );
};

export default NotFoundPage;