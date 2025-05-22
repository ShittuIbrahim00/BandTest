'use client';

import { useState, useEffect } from 'react'; 
import { useRouter, useSearchParams } from 'next/navigation'; 
import { TextField, Button, FormControlLabel, Checkbox, Typography, Box, Alert } from '@mui/material';
import Link from 'next/link';
import Cookies from 'js-cookies';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const autoLoggedOut = router?.query?.autologgedout;


  useEffect(() => {
    if (autoLoggedOut) {
      setError('You have been logged out due to inactivity.');
      router.replace('/login', undefined, { shallow: true });
    }
  }, [autoLoggedOut, router]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        const user = data.user;

        if (keepLoggedIn) {
          Cookies.setItem('authToken', token, { expires: 7 });
          Cookies.setItem('user', JSON.stringify(user), { expires: 7 });
          localStorage.setItem('keepLoggedIn', 'true');
        } else {
          Cookies.setItem('authToken', token);
          Cookies.setItem('user', JSON.stringify(user));
          localStorage.setItem('keepLoggedIn', 'false');
        }

        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md space-y-6"
      >
        <Typography variant="h4" component="h1" className="text-center font-extrabold text-gray-800">
          Welcome Back!
        </Typography>
        <Typography variant="body2" className="text-center text-gray-600 mb-4">
          Sign in to your account
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-50"
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-gray-50"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              color="primary"
            />
          }
          label="Keep me logged in"
          className="text-gray-700"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="py-3 text-lg font-semibold"
        >
          {loading ? 'Logging In...' : 'Login'}
        </Button>

        <Typography variant="body2" className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </Typography>
      </Box>
    </div>
  );
}
