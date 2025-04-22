import { useNavigate } from 'react-router-dom';
import styles from'./Header.module.css';
import { IoLogoBuffer } from 'react-icons/io';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setUser,  clearBoards} from '../../store/boardsSlice'; // Добавляем импорт setUser
import { MdOutlineLightMode } from 'react-icons/md';
import { CiDark } from 'react-icons/ci';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector(state => state.boards.theme);
  const user = useSelector(state => state.boards.user);

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(setUser(null)); 
    dispatch(clearBoards());
    navigate('/login');
  };

  return (
    <header>
      <div className={styles['header-left']} onClick={() => navigate('/')}>
        <h1>Trello</h1>
      </div>
      <div className={styles['header-right']}>
        {user ? (
          <>
            <span>{user.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={() => navigate('/login')}>Login</button>
        )}
        <button onClick={() => dispatch(toggleTheme())} className={styles['theme-toggle']}>
          {theme === 'light' ? <CiDark /> : <MdOutlineLightMode />}
        </button>
      </div>
    </header>
  );
};

export default Header;