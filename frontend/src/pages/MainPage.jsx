import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div className="main-page">
      <h1>Чат</h1>
      <p>Чат для общения с другими пользователями</p>

      <nav>
        <Link to="/login">Вход</Link>
      </nav>
    </div>
  );
};

export default MainPage;