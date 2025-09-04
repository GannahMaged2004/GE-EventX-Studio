// Footer
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className=" text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Gannah Eltonsy EventX Studio. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-indigo-400">Privacy</a>
          <a href="#" className="hover:text-indigo-400">Terms</a>
        </div>
      </div>
    </footer>
  );
}
