import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { login } from '../../util/http.js'; // Import the login function
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth.js';
import { setUser } from '../../store/userSlice';

function Login() {
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
 
    // Define mutation for login
    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            // Handle successful login
            dispatch(setUser({ username: data.name }));
            localStorage.setItem('username', data.username);
            dispatch(authActions.login());
            navigate('../game');
        },
        onError: (error) => {
            // Log error details to the console
            console.error('Login error:', error.message);
            setErrors({ general: error.message });
        }
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

        // Call login mutation
        mutation.mutate({
            email: data.email,
            password: data.password
        });
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
                            name="email"
                            placeholder="Enter your Email"
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                        />
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    {errors.general && <span className="error">{errors.general}</span>}
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
