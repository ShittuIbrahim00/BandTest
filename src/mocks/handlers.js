import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json();

    if (email === 'user@example.com' && password === 'password123') {
      return HttpResponse.json({
        token: 'mock-auth-token-123',
        user: {
          id: 'user-1',
          email: 'user@example.com',
          fullName: 'John Doe',
        },
      }, { status: 200 });
    } else {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  }),

  http.post('/api/register', async ({ request }) => {
    const { email, password, fullName } = await request.json();
    if (email && password && fullName) {
      return HttpResponse.json({
        message: 'Registration successful!',
        user: { id: `user-${Date.now()}`, email, fullName },
      }, { status: 201 });
    } else {
      return HttpResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
  }),

]