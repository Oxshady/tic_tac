import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../../util/http.js';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth.js';


function Login() {
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Fetch existing users
    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    function handleClose() {
        navigate('..');
    }

    function validateLogin(data) {
        let formErrors = {};
        if (!data.email) {
            formErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            formErrors.email = 'Email address is invalid';
        }
        if (!data.password) {
            formErrors.password = 'Password is required';
        }
        return formErrors;
    }

    function handleSubmit(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        const data = Object.fromEntries(fd.entries());

        // Validate the form data
        const formErrors = validateLogin(data);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        // Check if email and password match any user
        const user = users.find(
            (user) => user.email === data.email && user.password === data.password
        );
        if (!user) {
            setErrors({ email: 'Invalid email or password' });
            return;
        }
        
        // Handle successful login (e.g., dispatch login action)
        dispatch(authActions.login());

        // If successful, navigate to the user's page
        navigate('../game');
    }

    return (
        <>
            <button className="close-button" onClick={handleClose}>
                <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="loginPage">
                <form onSubmit={handleSubmit} className="login-form">
                    <h2 className="login-title">Login</h2>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"  // corrected name attribute
                            placeholder="Enter your Email"
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"  // corrected name attribute
                            placeholder="Password"
                            
                        />
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    <button type="submit" className="login-button">
                        Sign In
                    </button>
                    <p className="signup-link">
                        Don't have an account? <Link to="../signup">Sign up</Link>
                    </p>
                </form>
            </div>
        </>
    );
}

export default Login;
