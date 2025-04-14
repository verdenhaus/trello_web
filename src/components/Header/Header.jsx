import { useNavigate } from 'react-router-dom';
import './Header.css';
import { IoLogoBuffer } from "react-icons/io";
import { BoardsContext } from '../../context/BoardsProvider';
import { useContext } from 'react';
import { MdOutlineLightMode } from "react-icons/md";
import { CiDark } from "react-icons/ci";

const Header = () =>{

    const navigate = useNavigate()
    const { theme, toggleTheme } = useContext(BoardsContext);

    return(
        <header>
            <div className='header-left' onClick={()=>navigate('/')}>
                <h1>Trello</h1>
            </div>
            <div className='header-right'>
                <button onClick={toggleTheme} className="theme-toggle">
                    {theme === "light" ? <CiDark /> : <MdOutlineLightMode />}
                </button>
                
            </div>
        </header>
    )
}
export default Header;