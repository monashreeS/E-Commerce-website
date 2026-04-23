import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Signup() {

    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        branch: ''
    });
    
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, branch } = signupInfo;
        
        if (!name || !email || !password || !branch) {
            return handleError('Name, email, password and branch are required');
        }
        
        // FIX: Added basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return handleError('Please enter a valid email');
        }
        
        // FIX: Added password strength validation
        if (password.length < 4) {
            return handleError('Password must be at least 4 characters');
        }
        
        try {
            setLoading(true);
            
            // FIX: Use environment variable
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
            const url = `${apiUrl}/auth/signup`;
            
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            
            // FIX: Added response status checking
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            const { success, message, error } = result;
            
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (error) {
                const details = error?.details?.[0]?.message || message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            
        } catch (err) {
            console.error('Signup error:', err);
            handleError(err.message || 'Failed to signup');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className='container'>
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='name'
                        autoFocus
                        placeholder='Enter your name...'
                        value={signupInfo.name}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={signupInfo.email}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={signupInfo.password}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='branch'>Branch</label>
                    <select
                        name='branch'
                        value={signupInfo.branch}
                        onChange={handleChange}
                        required
                    >
                        <option value=''>Select Branch</option>
                        <option value='CSE'>CSE</option>
                        <option value='ECE'>ECE</option>
                        <option value='Mechanical'>Mechanical</option>
                        <option value='Civil'>Civil</option>
                        <option value='ISE'>ISE</option>
                    </select>
                </div>
                <button type='submit' disabled={loading}>
                    {loading ? 'Creating Account...' : 'Signup'}
                </button>
                <span>Already have an account?
                    <Link to="/login"> Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Signup;