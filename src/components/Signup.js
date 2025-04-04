"use client";

import { useState } from "react";
import { signup } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signup(email, password, username);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-white p-6">
      <div className="flex flex-col text-black px-4 pb-6 md:pb-0 border-b md:border-b-0 md:border-s-2 border-gray-500">
        <h1 className="text-6xl text-center md:text-left md:text-9xl">
          FlowLoved
        </h1>
        <h2 className="text-3xl text-center md:text-left md:text-6xl">Some.</h2>
        <h2 className="text-md text-center md:text-left md:text-xl">
          Money Management
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 w-full max-w-sm flex flex-col gap-3"
      >
        <h2 className="text-2xl text-gray-500 font-bold mb-4 text-center md:text-left">
          Sign Up
        </h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded"
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <p className="text-left">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-500 cursor-pointer"
          >
            Sign in here
          </span>
          .
        </p>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
