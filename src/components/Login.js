"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(identifier, password);
      router.push("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="flex h-fit w-auto self-center p-10">
        <div className="flex flex-col text-black px-4 pe-10 border-e">
          <div className="text-9xl">
            <h1>FlowLoved</h1>
            <span>Some.</span>
          </div>
          <span>Money Management</span>
        </div>
        <form onSubmit={handleLogin} className="p-4 mx-10 flex flex-col gap-3">
          <h2 className="text-2xl text-gray-500 font-bold mb-4">Login</h2>
          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-400 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-400 rounded"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <p>
            Dont have account? Register{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-blue-500 cursor-pointer"
            >
              here
            </span>
            .
          </p>
          <div className="flex justify-end">
            <button
              type="submit"
              className=" w-20 bg-blue-500 text-white p-2 rounded cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
