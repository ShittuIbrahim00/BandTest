import { http, HttpResponse } from 'msw';

const USERS_STORAGE_KEY = 'mockUsersDB';
const SALES_STORAGE_KEY = 'mockSalesDB';
const CATEGORY_STORAGE_KEY = 'mockCategoryDB';

const loadFromLocalStorage = (key, defaultValue) => {
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      return JSON.parse(storedData);
    }
  }
  return defaultValue;
};

const saveToLocalStorage = (key, data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

let users = loadFromLocalStorage(USERS_STORAGE_KEY, [
  {
    id: 'user-1',
    fullName: 'John Doe',
    email: 'user@example.com',
    password: 'password123',
    isLoggedIn: false
  },
  {
    id: 'user-2',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    isLoggedIn: false
  },
]);

let salesData = loadFromLocalStorage(SALES_STORAGE_KEY, [
  { date: '2024-01-15', revenue: 1200 },
  { date: '2024-02-10', revenue: 1500 },
  { date: '2024-03-05', revenue: 1300 },
  { date: '2024-04-20', revenue: 1800 },
  { date: '2024-05-12', revenue: 2000 },
  { date: '2024-06-01', revenue: 2500 },
  { date: '2024-07-08', revenue: 2200 },
  { date: '2024-08-14', revenue: 2800 },
  { date: '2024-09-03', revenue: 3000 },
  { date: '2024-10-11', revenue: 3200 },
  { date: '2024-11-01', revenue: 3500 },
  { date: '2024-12-05', revenue: 3800 },
]);

let categoryDistribution = loadFromLocalStorage(CATEGORY_STORAGE_KEY, [
  { name: 'Electronics', value: 400 },
  { name: 'Apparel', value: 300 },
  { name: 'Home Goods', value: 200 },
  { name: 'Books', value: 100 },
  { name: 'Other', value: 50 },
]);

export const handlers = [
  // Mock Registration Endpoint
  http.post('/api/register', async ({ request }) => {
    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
      return HttpResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return HttpResponse.json({ message: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    if (users.some(user => user.email === email)) {
      return HttpResponse.json({ message: 'Email already registered.' }, { status: 409 });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      fullName,
      email,
      password,
      registrationDate: new Date().toISOString().split('T')[0],
      isLoggedIn: false
    };
    users.push(newUser);
    saveToLocalStorage(USERS_STORAGE_KEY, users);

    console.log('Registered new user (mock):', newUser);
    return HttpResponse.json({
      message: 'Registration successful!',
      user: { id: newUser.id, email: newUser.email, fullName: newUser.fullName, status: newUser.isLoggedIn },
    }, { status: 201 });
  }),

  // Mock Login Endpoint
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json();
    const userIndex = users.findIndex(user => user.email === email && user.password === password);
  
    if (userIndex !== -1) {
      const foundUser = users[userIndex];
      foundUser.isLoggedIn = true;
  
      // Set all others to false to ensure only one is logged in
      users = users.map((user, index) =>
        index === userIndex ? { ...user, isLoggedIn: true } : { ...user, isLoggedIn: false }
      );
  
      saveToLocalStorage(USERS_STORAGE_KEY, users);
      localStorage.setItem('loggedInUserId', foundUser.id); // Store the logged-in user ID
  
      return HttpResponse.json({
        token: `mock-auth-token-${foundUser.id}-${Date.now()}`,
        user: {
          id: foundUser.id,
          email: foundUser.email,
          fullName: foundUser.fullName,
          isLoggedIn: true
        },
      }, { status: 200 });
    }
  
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),  
  // --- Dashboard Data Endpoints ---

  // Metrics Summary
  http.get('/api/metrics', () => {
    const totalSalesRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
    const totalUsers = users.length;
    // Active sessions is hard to mock persistently without a real backend.
    // Let's make it a simple random number for demonstration.
    const activeSessions = Math.floor(Math.random() * 5) + 1;

    return HttpResponse.json({
      totalUsers: totalUsers,
      activeSessions: activeSessions,
      salesRevenue: totalSalesRevenue,
    });
  }),

  // Sales Trends (Line Chart)
  http.get('/api/sales-trends', () => {
    // Return sales data sorted by date for the line chart
    const sortedSales = [...salesData].sort((a, b) => new Date(a.date) - new Date(b.date));
    return HttpResponse.json(sortedSales);
  }),

  // User Growth (Bar Chart) - Group by month of registration
  http.get('/api/user-growth', () => {
    const monthlyGrowth = users.reduce((acc, user) => {
      if (user.registrationDate) {
        const month = user.registrationDate.substring(0, 7); // YYYY-MM
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {});

    // Convert to array format for chart
    const growthArray = Object.keys(monthlyGrowth)
      .sort() // Sort by month
      .map(month => ({
        month,
        users: monthlyGrowth[month],
      }));

    return HttpResponse.json(growthArray);
  }),

  // Category Distribution (Pie/Donut Chart)
  http.get('/api/category-distribution', () => {
    return HttpResponse.json(categoryDistribution);
  }),

  // Sample User Data Table
  http.get('/api/users-data', () => {
    const loggedInUserId = typeof window !== 'undefined' ? localStorage.getItem('loggedInUserId') : null;
  
    // Reflect the current login status in the response
    const tableUsers = users.map(user => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      registrationDate: user.registrationDate,
      isLoggedIn: user.id === loggedInUserId, // Only logged-in user is marked true
    }));
  
    return HttpResponse.json(tableUsers);
  }),
  
];