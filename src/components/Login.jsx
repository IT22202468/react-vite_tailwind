import React, { useState } from 'react'
import { loginUser } from '../services/auth-api'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const result = await loginUser(form);
        if (result.ok) {
            localStorage.setItem('token', result.data.token);
            setMessage(`Login successful. Role: ${result.data.role}`);
            if (result.data.role === 'admin') {
                navigate('/admin');
            } else if (result.data.role === 'user') {
                navigate('/dashboard');
            }
        } else {
            setMessage(result.data.message);
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="justify-start block text-sm/6 font-medium text-gray-900">Username</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="username"
                                id="username"
                                autoComplete="username"
                                required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                placeholder="Enter your username"
                                onChange={handleChange}
                                value={form.username}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                autoComplete="current-password" 
                                required 
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                onChange={handleChange}
                                value={form.password}
                            />
                        </div>
                    </div>

                    <div>
                        <button 
                            type="submit" 
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                    
                    {message && (
                        <div className={`mt-2 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </div>
                    )}
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Not a member? 
                    <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500"> Create an account</a>
                </p>
            </div>
        </div>
    )
}

export default Login
