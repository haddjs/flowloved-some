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
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-white p-6">
      <div className="flex flex-col text-black px-4 pb-6 md:pb-0 border-b md:border-b-0 md:border-e-2 border-black">
        <h1 className="text-6xl text-center md:text-left md:text-9xl">
          FlowLoved
        </h1>
        <h2 className="text-3xl text-center md:text-left md:text-6xl">Some.</h2>
        <h2 className="text-md text-center md:text-left md:text-xl">
          Money Management
        </h2>
      </div>
      <form
        onSubmit={handleLogin}
        className="p-4 w-full max-w-sm flex flex-col gap-3"
      >
        <h2 className="text-2xl text-gray-500 font-bold mb-4 text-center md:text-left">
          Login
        </h2>
        <input
          type="text"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
          required
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <p className="text-left">Don&apost;t have an account?</p>
        <span
          onClick={() => router.push("/register")}
          className="text-blue-500 cursor-pointer"
        >
          Register here.
        </span>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
