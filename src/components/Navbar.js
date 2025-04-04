"use client";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { Skeleton } from "@mui/material";

const AUTO_LOGOUT_TIME = 5 * 60 * 1000;

const Navbar = () => {
  const { username, logout, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
        alert("Session is expired");
        router.push("/login");
      }, AUTO_LOGOUT_TIME);
    };

    const handleActivity = () => resetTimer();

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    resetTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [logout, router]);

  const handleNavigate = (path) => {
    if (pathname !== path) {
      router.push(path);
    }
  };

  return (
    <nav className="flex justify-between items-center bg-blue-400 text-white min-w-full px-6 py-2 shadow-md">
      <div className="text-xl flex items-center gap-3">
        <h1 className="content-center">
          FlowLoved<span className="font-bold">Some</span>.
        </h1>
      </div>

      <div className="flex gap-10 text-lg">
        <span
          className="hover:bg-white hover:scale-105 hover:text-black transition-all ease-in-out px-3 py-2 rounded-2xl cursor-pointer"
          onClick={() => handleNavigate("/dashboard")}
        >
          Dashboard
        </span>
        <span
          className="hover:bg-white hover:scale-105 hover:text-black transition-all ease-in-out px-3 py-2 rounded-2xl cursor-pointer"
          onClick={() => handleNavigate("/transaction")}
        >
          Transaction
        </span>
        <span
          className="hover:bg-white hover:scale-105 hover:text-black transition-all ease-in-out px-3 py-2 rounded-2xl cursor-pointer"
          onClick={() => handleNavigate("/mutation")}
        >
          Mutation
        </span>
      </div>

      <div className="relative">
        <div
          className="flex items-center gap-3 bg-white text-black rounded-xl px-3 py-2 my-2 cursor-pointer hover:bg-gray-200 transition-all"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {loading ? (
            <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
          ) : (
            <h1 className="text-md">{username}</h1>
          )}
          <Image
            src="/images/panda.png"
            alt="Profile Pic"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">
            <button className="block px-4 py-2 text-left hover:bg-gray-200 w-full">
              Settings
            </button>
            <button
              onClick={logout}
              className="block px-4 py-2 text-left hover:bg-gray-200 w-full"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
