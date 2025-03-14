"use client";
import { useRouter } from "next/router";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("auth/login");
  };
  return (
    <nav className="flex justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-lg font-bold">FlowLovedSome</h1>
      <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
