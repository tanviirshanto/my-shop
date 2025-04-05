"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("viewer");
  const [message, setMessage] = useState(""); // Renamed to message for both success and error
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message state
  
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
  
    // Make a POST request to register the user
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });
  
    const data = await res.json();
  
    // Check if response status is success (200-299)
    if (res.ok) {
      setMessage(data.message || "Registration successful! Redirecting...");
      setTimeout(() => {
        router.push("/signin");
      }, 2000); // Wait for 2 seconds before redirecting
    } else {
      setMessage(data.message || "Something went wrong.");
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="card w-96 border border-gray-400 shadow-xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

        {message && (
          <div
            className={`alert ${message.includes("successful") ? "alert-success" : "alert-error"} mb-4`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label" htmlFor="name">
              <span className="label-text">Full Name</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label" htmlFor="email">
              <span className="label-text">Email</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label" htmlFor="password">
              <span className="label-text">Password</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label" htmlFor="confirmPassword">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label" htmlFor="role">
              <span className="label-text">Role</span>
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="select select-bordered w-full"
              required
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full mb-4">
            Register
          </button>
        </form>

        <p className="text-center">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-500 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
