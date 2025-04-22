import { IoIosLogIn } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { TbLockAccess } from "react-icons/tb";
import { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/boardsSlice';
import styles from './Login.module.css';

function Login() {

    const dispatch = useDispatch();

    const [data, setData] = useState({
        email: null,
        password: null
    })
    
    const [error, setError] = useState(null)
    
    const [eye, setEye] = useState(true)

    const navigate = useNavigate()

    const eyeChange = () => {
        eye === true ? setEye(false)  : setEye(true)
    }


    let handleLogUser = () => {
        setError(null)
        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    if (response.status === 400) {
                        throw new Error(err.message || "Неверные учетные данные");
                    }
                    throw new Error("Ошибка входа");
                });
            }
            return response.json();
        })
        .then(data => {
            console.log(data); 
            const userData = {...data.user, accessToken: data.accessToken};
            localStorage.setItem('user', JSON.stringify(userData));
            dispatch(setUser(userData));
            navigate("/");
          })
        .catch(error => {
            console.error("Произошла ошибка:", error);
            console.log(error.message);
            setError(error.message)
        });
    }   

    return (
        <div className={styles['reg-cont']}>
            <div className={styles.register}>
                <div className={styles['register-icon']}>
                    <h1>Login</h1>
                </div>
                <div className={styles['register-form']}>
                    <div className={styles['reg-form-div']}>
                        <FiUser />
                        <input type="text" placeholder='email...' onChange={(e)=>setData({...data, email: e.target.value})}/>
                    </div>
                    <div className={styles['reg-form-div']}>
                        <TbLockAccess />
                        <input type={eye === true ? "password" : "text" }  placeholder='password...' onChange={(e)=>setData({...data, password: e.target.value})} />
                        <button onClick={eyeChange}>{eye === true ? <FaRegEye /> : <FaRegEyeSlash /> }</button>
                    </div>
                    {
                        error && <p className={styles.error}>{error}</p>
                    }
                </div>
                <div className={styles['reg-button']}>
                    <button onClick={handleLogUser}>Login</button>
                    <button onClick={()=>navigate('/register')}>Registration</button>
                </div>
            </div>
        </div>
    );
}

export default Login;