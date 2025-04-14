import { useNavigate } from 'react-router-dom';
import './Header.css';
import { IoLogoBuffer } from 'react-icons/io';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/boardsSlice';
import { MdOutlineLightMode } from 'react-icons/md';
import { CiDark } from 'react-icons/ci';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector(state => state.boards.theme);

  return (
    <header>
      <div className="header-left" onClick={() => navigate('/')}>
        <h1>Trello</h1>
      </div>
      <div className="header-right">
        <button onClick={() => dispatch(toggleTheme())} className="theme-toggle">
          {theme === 'light' ? <CiDark /> : <MdOutlineLightMode />}
        </button>
      </div>
    </header>
  );
};

export default Header;