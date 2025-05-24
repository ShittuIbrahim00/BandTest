'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Typography, Box, Button, Alert, Card, CardContent, CircularProgress, Switch } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { DataGrid } from "@mui/x-data-grid";
import Cookies from "js-cookies";
import { motion } from "framer-motion";

import { useColorMode } from '../ThemeRegistry'; 

const INACTIVITY_TIMEOUT = 60000;

const PIE_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

export default function DashboardPage() {
  const { toggleColorMode } = useColorMode();
  const router = useRouter();
  const logoutTimerRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeSessions: 0,
    salesRevenue: 0,
  });
  const [salesTrends, setSalesTrends] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [userData, setUserData] = useState([]);

  const [isDarkMode, setIsDarkMode] = useState(false);


  const performLogout = (showAutoLogoutAlert = false) => {
    Cookies.removeItem("authToken");
    Cookies.removeItem("user");
    localStorage.removeItem("keepLoggedIn");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");

    if (showAutoLogoutAlert) {
      router.push("/login?autologgedout=true");
    } else {
      router.push("/login");
    }
  };

  const resetTimer = () => {
    const keepLoggedIn = localStorage.getItem("keepLoggedIn");
    if (keepLoggedIn === "false") {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = setTimeout(() => {
        console.log('User inactive, logging out...');
        performLogout(true);
      }, INACTIVITY_TIMEOUT);
    }
  };

  const handleActivity = () => {
    resetTimer();
  };

  const handleThemeToggle = (event) => {
    setIsDarkMode(event.target.checked);
    toggleColorMode();
  };

  useEffect(() => {
  if (typeof window !== 'undefined') {
      setIsDarkMode(localStorage.getItem('appThemeMode') === 'dark');
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        const storedUser = Cookies.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          performLogout();
          return;
        }

        const [metricsRes, salesRes, userGrowthRes, categoryRes, usersDataRes] =
          await Promise.all([
            fetch("/api/metrics"),
            fetch("/api/sales-trends"),
            fetch("/api/user-growth"),
            fetch("/api/category-distribution"),
            fetch("/api/users-data"),
          ]);
        
        if (!metricsRes.ok || !salesRes.ok || !userGrowthRes.ok || !categoryRes.ok || !usersDataRes.ok) {
          throw new Error('Failed to fetch dashboard data from one or more endpoints.');
        }

        const metricsData = await metricsRes.json();
        const salesData = await salesRes.json();
        const userGrowthData = await userGrowthRes.json();
        const categoryData = await categoryRes.json();
        const usersTableData = await usersDataRes.json();

        setMetrics(metricsData);
        setSalesTrends(salesData);
        setUserGrowth(userGrowthData);
        setCategoryDistribution(categoryData);
        setUserData(usersTableData);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError(`Failed to load dashboard data ${err.message || "Please try again."}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    resetTimer();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, []);

  const userTableColumns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "registrationDate", headerName: "Registration Date", width: 180 },
    {
      field: "status",
      headerName: "Status",
      width: 180,
      renderCell: (params) => {
        return params.row.isLoggedIn ? (
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
            Online
          </span>
        ) : (
          <span className="bg-gray-300 text-black px-2 py-1 rounded-full text-sm">
            Offline
          </span>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <motion.div
          initial={{ opacity: 0, y: -150 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeIn" }}
        >
          <CircularProgress sx={{ color: isDarkMode ? 'white' : 'primary.main' }} />
          <Typography variant="h6" className={`ml-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Loading Dashboard...
          </Typography>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <motion.div
          initial={{ opacity: 0, y: -150 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeIn" }}
        >
          <Alert severity="error">{error}</Alert>
          <Button onClick={() => window.location.reload()} className="ml-4">
            Retry
          </Button>
          <Button onClick={() => router.push("/login")} className="ml-4">
            Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className={`flex flex-col min-h-screen p-4 md:p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Box className={`flex flex-col sm:flex-row justify-between items-center mb-8 p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center gap-4">
          <Typography
            variant="h4"
            component="h1"
            className={`font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
          >
            Analytics Dashboard {user ? (`${user.fullName}`) : ''}
          </Typography>
          {user?.isLoggedIn && (
            <p className="bg-green-500 h-3 w-3 rounded-full" />
          )}
        </div>

        {/* Theme Toggle & Logout Button */}
        <Box className="flex items-center space-x-4 mt-4 sm:mt-0">
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={handleThemeToggle}
                name="darkModeToggle"
                color="primary"
              />
            }
            label={isDarkMode ? "Dark Mode" : "Light Mode"}
            className={isDarkMode ? "text-gray-300" : "text-gray-700"}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => performLogout()}
            className="px-6 py-2"
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Metrics Summary */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeIn" }}
      >
        {[
          {
            label: "Total Users",
            value: metrics.totalUsers,
            color: "text-blue-600",
            darkColor: "dark:text-blue-400"
          },
          {
            label: "Active Sessions",
            value: metrics.activeSessions,
            color: "text-green-600",
            darkColor: "dark:text-green-400"
          },
          {
            label: "Sales Revenue",
            value: `$${metrics.salesRevenue.toLocaleString()}`,
            color: "text-purple-600",
            darkColor: "dark:text-purple-400"
          },
        ].map((item, index) => (
          <Card key={index} className={`shadow-lg hover:shadow-xl transition ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                {item.label}
              </Typography>
              <Typography
                variant="h5"
                component="div"
                className={`font-bold ${item.color} ${item.darkColor}`}
              >
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Sales Trends */}
        <Card className={`col-span-1 lg:col-span-2 xl:col-span-1 shadow-lg p-4 h-[400px] flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardContent className="flex-grow flex flex-col">
            <Typography
              variant="h6"
              className={`mb-4 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
            >
              Sales Trends (Monthly Revenue)
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#ccc"} />
                <XAxis dataKey="date" stroke={isDarkMode ? "#ccc" : "#333"} />
                <YAxis stroke={isDarkMode ? "#ccc" : "#333"} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', border: isDarkMode ? '1px solid #555' : '1px solid #ccc', color: isDarkMode ? '#fff' : '#000' }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={isDarkMode ? "#9a9aff" : "#8884d8"}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className={`shadow-lg p-4 h-[400px] flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardContent className="flex-grow flex flex-col">
            <Typography
              variant="h6"
              className={`mb-4 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
            >
              User Growth (Monthly Registrations)
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#ccc"} />
                <XAxis dataKey="month" stroke={isDarkMode ? "#ccc" : "#333"} />
                <YAxis stroke={isDarkMode ? "#ccc" : "#333"} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', border: isDarkMode ? '1px solid #555' : '1px solid #ccc', color: isDarkMode ? '#fff' : '#000' }} />
                <Legend />
                <Bar dataKey="users" fill={isDarkMode ? "#a7f3d0" : "#82ca9d"} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className={`shadow-lg p-4 h-[400px] flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardContent className="flex-grow flex flex-col">
            <Typography
              variant="h6"
              className={`mb-4 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
            >
              Category Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', border: isDarkMode ? '1px solid #555' : '1px solid #ccc', color: isDarkMode ? '#fff' : '#000' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <Card className={`shadow-lg p-4 flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <CardContent className="flex-grow">
          <Typography variant="h6" className={`mb-4 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
            Registered Users Data
          </Typography>
          <div className="h-[400px] w-full">
            <DataGrid
              rows={userData}
              columns={userTableColumns}
              pageSizeOptions={[5, 10, 20]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5, page: 0 } },
              }}
              checkboxSelection={false}
              disableRowSelectionOnClick
              className="bg-white rounded-lg"
              sx={{
                // Override DataGrid's internal styles for full dark mode.
                '& .MuiDataGrid-root': {
                  color: isDarkMode ? '#fff' : 'inherit',
                  borderColor: isDarkMode ? '#333' : 'inherit',
                  backgroundColor: isDarkMode ? '#1e1e1e' : 'inherit', // Background for the grid itself
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: isDarkMode ? '#222' : '#f5f5f5',
                  color: isDarkMode ? '#fff' : 'inherit',
                  borderColor: isDarkMode ? '#333' : 'inherit',
                },
                '& .MuiDataGrid-cell': {
                  borderColor: isDarkMode ? '#333' : 'inherit',
                },
                '& .MuiTablePagination-root': {
                  color: isDarkMode ? '#fff' : 'inherit',
                },
                '& .MuiSvgIcon-root': { // For pagination icons
                  color: isDarkMode ? '#fff' : 'inherit',
                },
                '& .MuiDataGrid-footerContainer': {
                  backgroundColor: isDarkMode ? '#222' : '#f5f5f5',
                  borderColor: isDarkMode ? '#333' : 'inherit',
                },
                '& .MuiDataGrid-virtualScrollerContent': {
                  backgroundColor: isDarkMode ? '#1e1e1e' : 'inherit', // Content area background
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}