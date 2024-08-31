import './Auth.css';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { NewUser, fetchUsers } from '../../util/http';
import { authActions } from '../../store/auth.js';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleClose() {
        navigate('..');
    }

    // Fetch existing users
    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    const { mutate, isLoading, isError, error } = useMutation({
        mutationFn: NewUser,
        onSuccess: () => {
            // Clear form data on success
            
            setFormData({ name: '', email: '', password: '' });
            dispatch(authActions.login());
            navigate('/');
        },
    });

    function validateForm(data) {
        let formErrors = {};
        if (!data.name) formErrors.name = 'Name is required';
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

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
     
        const formErrors = validateForm(formData);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
     
        const emailExists = users.some((user) => user.email === formData.email);
        if (emailExists) {
            setErrors({ email: 'Email is already registered' });
            return;
        }
    
        console.log('Form data being sent:', formData);
        console.log(formData.name);
        dispatch(setUser({ username: formData.name }));
        localStorage.setItem("username", formData.name);

        // dispatch(authActions.login());
        navigate('../game');
        mutate({
            
            name: formData.name,
            email: formData.email,
            password: formData.password,
        });
     }
     

    return (
        <>
            <button className="close-button" onClick={handleClose}>
                <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="signupPage">
                <h2 className="signup-title">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name">Username</label>
                        <input
                            onChange={handleChange}
                            placeholder="Enter your name"
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                        />
                    </div>
                    {errors.name && <span className="error">{errors.name}</span>}
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Write your email"
                        />
                    </div>
                    {errors.email && <span className="error">{errors.email}</span>}
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                    </div>
                    {errors.password && (
                            <span className="error">{errors.password}</span>
                        )}
                    <div className="center-btn">
                        <button type="submit" className="signup-button" disabled={isLoading}>
                            {isLoading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </div>

                    <p className="login-link">
                        Already have an account? <Link to="../login">Login</Link>
                    </p>
                    {isError && (
                        <div className="error">Signup failed: {error.message}</div>
                    )}
                </form>
            </div>
        </>
    );
}

export default SignUp;
