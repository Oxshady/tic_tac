import React, { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import ProfileImg from "../img/avatar.png"
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/auth';
import { clearUser } from '../store/userSlice';


function SideBar() {
    const [isDashboardVisible, setIsDashboardVisible] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const toggleDashboard = () => {
        setIsDashboardVisible(!isDashboardVisible);
    };
    const isAuth = useSelector(state => state.auth.isAuthenticated);
    const userName = useSelector(state => state.user.username);


    function handleLogout() {
        dispatch(authActions.logout());
        // Remove the isAuth value from local storage
        dispatch(clearUser());
        localStorage.removeItem('isAuthenticated');
    }
    function handleLogin() {
        navigate("/login")
    }

    return (
        <>
            <div className="menu-toggle" onClick={toggleDashboard}>
                <i className="fas fa-bars" />
            </div>
            <div className={`dashboard  ${isDashboardVisible ? 'appear' : ''}`}>
                {isAuth &&
                    <div className="user">
                        <img src={ProfileImg} alt="User Avatar" />
                        {userName && <h3>{userName}</h3>}
                        {!userName && <h3>Guest</h3>}
                        <p>Pro Member</p>
                    </div>
                }
                {/* {!isAuth 

                } */}
                {!isAuth &&
                    <i class="fa-solid fa-user user-icon" onClick={handleLogin} ></i>
                }
                {isAuth &&

                    <i class="fa-solid fa-right-from-bracket icon-style " onClick={handleLogout}></i>
                }


                <div className="links">
                    <ul className="nav-list">
                        <NavLink to="/" className="nav" end >
                            <li className={`link ${location.pathname === '/' ? 'active' : ''}`}>
                                <i className="fas fa-home" />
                                <p className='navlink'>Home</p>
                            </li>
                        </NavLink>
                        <NavLink to="/game" className="nav" end>
                            <li className={`link ${location.pathname === '/game' ? 'active' : ''}`}>
                                <i className="fas fa-gamepad" />
                                <p className='navlink'>Game</p>
                            </li>
                        </NavLink>
                        <NavLink to="/rank" className="nav" end>
                            <li className={`link ${location.pathname === '/rank' ? 'active' : ''}`}>
                                <i className="fas fa-trophy" />
                                <p className='navlink'>Rank</p>
                            </li>
                        </NavLink>

                    </ul>
                </div>
            </div>
        </>
    )
}

export default SideBar
