"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import Link from "next/link";
import Floatingshape from "@/components/FloatingShape";
import { easeIn, motion } from "framer-motion";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful! You can now log in.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        "An unexpected error occurred during registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-orange-500 via-orange-200 to-orange-500 p-4">
      <Floatingshape
        color="bg-white"
        size="lg:w-52 lg:h-52 md:w-40 md:h-40 w-16 h-16"
        top="10%"
        left="5%"
        delay={2}
      />

      <Floatingshape
        color="bg-black"
        size="lg:w-56 lg:h-56 md:w-44 md:h-44 w-20 h-20"
        top="30%"
        right="20%"
        delay={5}
      />

      <Floatingshape
        color="bg-yellow-300"
        size="lg:w-48 lg:h-48 md:w-36 md:h-36 w-16 h-16"
        top="-10%"
        right="20%"
        delay={2}
      />

      <Floatingshape
        color="bg-purple-300"
        size="lg:w-44 lg:h-44 md:w-32 md:h-32 w-14 h-14"
        top="50%"
        left="15%"
        delay={0}
      />

      <motion.h1
        initial={{ opacity: 0, y: -80 }}
        whileInView={{ opacity: 1, y: -10 }}
        transition={{ delay: 0.3, duration: 0.7, easeIn }}
        className="text-4xl font-extrabold capitalize text-[#F97316]"
      >
        Create Account
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.9, easeIn }}
        className="text-white text-sm md:text-lg text-center mb-1"
      >
        Join us and get started
      </motion.p>

      <Box
        component="form"
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: "easeIn" }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Alert severity="success" className="mb-4">
                {success}
              </Alert>
            </motion.div>
          )}
          <div className="mb-2">
            <label
              htmlFor="fullName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-orange-300"
              placeholder="Full Name"
            />
          </div>

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

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-orange-300"
              placeholder="********"
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            className="py-2 font-semibold w-full bg-[#F97316] hover:bg-orange-500 rounded-md cursor-pointer text-white"
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>

          <Typography
            variant="body2"
            className="text-center text-gray-600 py-2"
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#F97316] hover:underline font-medium"
            >
              Login here
            </Link>
          </Typography>
        </motion.div>
      </Box>
    </div>
  );
}
