"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import Link from "next/link";
import Cookies from "js-cookies";
import Floatingshape from "@/components/FloatingShape";
import LoginLeftGrid from "@/components/LoginLeftGrid";
import { easeIn, motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const autoLoggedOut = router?.query?.autologgedout;

  useEffect(() => {
    if (autoLoggedOut) {
      setError("You have been logged out due to inactivity.");
      router.replace("/login", undefined, { shallow: true });
    }
  }, [autoLoggedOut, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        const user = data.user;

        if (keepLoggedIn) {
          Cookies.setItem("authToken", token, { expires: 7 });
          Cookies.setItem("user", JSON.stringify(user), { expires: 7 });
          localStorage.setItem("keepLoggedIn", "true");
        } else {
          Cookies.setItem("authToken", token);
          Cookies.setItem("user", JSON.stringify(user));
          localStorage.setItem("keepLoggedIn", "false");
        }
        setLoading(false);
        router.push("/dashboard");
      } else {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen lg:flex md:flex grid w-full">
      <Floatingshape
        color={`bg-white`}
        size={`lg:w-48 lg:h-64 md:w-44 md:h-44 w-20 h-20`}
        top={`md:-5% -2%`}
        left={`md:15% 10%`}
        delay={3}
      />
      <Floatingshape
        color={`bg-white`}
        size={`lg:w-64 lg:h-64 md:w-44 md:h-44 w-20 h-20`}
        bottom={`38%`}
        left={`-10%`}
        delay={1}
      />
      <Floatingshape
        color={`bg-[#F97316]`}
        size={`lg:w-64 lg:h-64 md:w-44 md:h-44 w-20 h-20`}
        top={`-20%`}
        left={`50%`}
        delay={0}
      />
      <Floatingshape
        color={`bg-[#F97316]`}
        size={`lg:w-60 lg:h-32 md:w-44 md:h-44 w-20 h-20`}
        bottom={`38%`}
        right={`18%`}
        delay={2}
      />
      <LoginLeftGrid />
      <div className="lg:w-1/2 md:w-1/2 mt-8 flex flex-col justify-center items-center">
        <motion.h1
          initial={{ opacity: 0, y: -80 }}
          whileInView={{ opacity: 1, y: -10 }}
          transition={{ delay: 0.3, duration: 0.7, easeIn }}
          className="text-4xl font-extrabold capitalize text-[#F97316]"
        >
          Welcome Back!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9, easeIn }}
          className="text-gray-800 text-sm md:text-lg text-center mb-1"
        >
          Sign in by entering information below:
        </motion.p>
        <Box component="form" onSubmit={handleSubmit} className="w-2/3">
          <motion.div initial={{opacity: 0, x: 100}} whileInView={{opacity: 1, x: 0}} transition={{delay: 0.7, duration: 0.9, ease: "easeIn" }}>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Alert severity="error" className="my-4">
                  {error}
                </Alert>
              </motion.div>
            )}
            <div className="mb-2">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring focus:ring-orange-300"
                placeholder="demo@demo.com"
              />
            </div>

            <div className="mb-1">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring focus:ring-orange-300"
                placeholder="********"
              />
            </div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  color="primary"
                />
              }
              label="Keep me logged in"
              className="text-black"
            />
            <motion.button
              type="submit"
              disabled={loading}
              className="py-2 font-semibold w-full bg-[#F97316] hover:bg-orange-500 rounded-md cursor-pointer text-white"
            >
              {loading ? "Logging In..." : "Login"}
            </motion.button>

            <Typography
              variant="body2"
              className="text-center text-gray-600 py-2"
            >
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#F97316] hover:underline font-medium"
              >
                Register here
              </Link>
            </Typography>
          </motion.div>
        </Box>
      </div>
    </div>
  );
}
