
import React, { useState } from 'react';

interface SignInProps {
    showNotification: (message: string, type: 'success' | 'error') => void;
}

const SignIn: React.FC<SignInProps> = ({ showNotification }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                showNotification('Signin successful!', 'success');
            } else {
                const data = await response.json();
                showNotification(`Signin failed: ${data.message}`, 'error');
            }
        } catch (error) {
            showNotification('An unexpected error occurred.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign In</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
            </button>
        </form>
    );
};

export default SignIn;
