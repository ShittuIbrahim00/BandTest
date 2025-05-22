"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Typography, Box, Button, Alert, Card, CardContent, CircularProgress } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { DataGrid } from "@mui/x-data-grid";
import Cookies from "js-cookies";

const INACTIVITY_TIMEOUT = 60000;

const PIE_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

export default function DashboardPage() {
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
        console.log("User inactive, logging out...");
        performLogout(true);
      }, INACTIVITY_TIMEOUT);
    }
  };

  const handleActivity = () => {
    resetTimer();
  };

  useEffect(() => {
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
        setError("Failed to load dashboard data. Please try again.");
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
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">Online</span>
        ) : (
          <span className="bg-gray-300 text-black px-2 py-1 rounded-full text-sm">Offline</span>
        );
      },
    },
  ];
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <CircularProgress />
        <Typography variant="h6" className="ml-4 text-gray-700">
          Loading Dashboard...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => window.location.reload()} className="ml-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-8">
      <Box className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-md relative">
        <Typography
          variant="h4"
          component="h1"
          className="font-extrabold text-gray-800"
        >
          Analytics Dashboard {user ? `${user.fullName}` : ""}{" "}
          {user.isLoggedIn ? (
            <p className="bg-green-500 top-6 left-[36%] -translate-1/2 absolute p-2 rounded-full"></p>
          ) : (
            <p></p>
          )}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => performLogout()}
          className="px-6 py-2"
        >
          Logout
        </Button>
      </Box>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Users
            </Typography>
            <Typography
              variant="h5"
              component="div"
              className="font-bold text-blue-600"
            >
              {metrics.totalUsers}
            </Typography>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Sessions
            </Typography>
            <Typography
              variant="h5"
              component="div"
              className="font-bold text-green-600"
            >
              {metrics.activeSessions}
            </Typography>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Sales Revenue
            </Typography>
            <Typography
              variant="h5"
              component="div"
              className="font-bold text-purple-600"
            >
              ${metrics.salesRevenue.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Sales Trends Line Chart */}
        <Card className="col-span-1 lg:col-span-2 xl:col-span-1 shadow-lg p-4 h-[400px] flex flex-col">
          <CardContent className="flex-grow flex flex-col">
            <Typography
              variant="h6"
              className="text-gray-700 mb-4 font-semibold"
            >
              Sales Trends (Monthly Revenue)
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-lg p-4 h-[400px] flex flex-col">
          <CardContent className="flex-grow flex flex-col">
            <Typography
              variant="h6"
              className="text-gray-700 mb-4 font-semibold"
            >
              User Growth (Monthly Registrations)
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userGrowth}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-lg p-4 h-[400px] flex flex-col">
          <CardContent className="flex-grow flex flex-col">
            <Typography
              variant="h6"
              className="text-gray-700 mb-4 font-semibold"
            >
              Category Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
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
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-full shadow-lg p-4 flex flex-col">
        <CardContent className="flex-grow">
          <Typography variant="h6" className="text-gray-700 mb-4 font-semibold">
            Registered Users Data
          </Typography>
          <div className="h-[400px] w-full">
            <DataGrid
              rows={userData}
              columns={userTableColumns}
              pageSizeOptions={[5, 10, 20]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5, page: 0 },
                },
              }}
              checkboxSelection={false} 
              disableRowSelectionOnClick 
              className="bg-white rounded-lg"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
