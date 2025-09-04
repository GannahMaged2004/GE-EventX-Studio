// Not Found Page
import React from "react";
import { Link } from "react-router-dom";


export default function NotFound() {
  return (
    <div className=" flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4 text-amber-300">404</h1>
      <p className="mb-6 text-white">Oops! The page you are looking for does not exist.</p>

      <Link
        to="/"
        className="px-4 py-2 btn gradient-btn text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
