import styles from './Register.module.css';
import { FaRegAddressCard } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { TbLockAccess } from "react-icons/tb";
import { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/boardsSlice';

function Register() {
    const dispatch = useDispatch();

    const [data, setData] = useState({
        email: null,
        password: null
    })
    
    const [eye, setEye] = useState(true)

    const navigate = useNavigate()

    const eyeChange = () => {
        eye === true ? setEye(false)  : setEye(true)
    }


    let handleCreateUser = () => {
        fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка HTTP, статус " + response.status);
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
        });
    }   

    return (
        <div className={styles['reg-cont']}>
            <div className={styles.register}>
                <div className={styles['register-icon']}>
                    <h1>Registration</h1>
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
                </div>
                <div className={styles['reg-button']}>
                    <button onClick={handleCreateUser}>Register</button>
                    <button onClick={()=>navigate('/login')}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default Register;