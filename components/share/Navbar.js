import Link from "next/link";
import { useState } from "react";
import { useEffect, useRef } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transform transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"} bg-white border-b border-gray-400 text-black tracking-widest px-6 py-6 flex items-center justify-between uppercase`}
    >
      <div className="flex w-full items-center justify-between">
        <div className="text-xl  whitespace-nowrap flex-shrink-0">Gallery App</div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none p-2 border-gray-700 rounded-m hover:text-gray-900 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className={`
          fixed top-0 left-0 w-full h-screen z-40 flex flex-col items-center justify-center backdrop-blur-xl text-center
          transition-opacity duration-300 md:static md:flex md:flex-row md:justify-end md:items-center md:bg-transparent md:h-auto md:inset-auto md:z-auto
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          md:opacity-100 md:pointer-events-auto
        `}>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-2xl font-bold text-black md:hidden"
          >
            ×
          </button>
          <Link href="/"><span onClick={() => setIsOpen(false)} className="block w-full md:w-auto text-center md:text-right py-2 px-4 text-black transition-all duration-200">Home</span></Link>
          <Link href="/gallery"><span onClick={() => setIsOpen(false)} className="block w-full md:w-auto text-center md:text-right py-2 px-4 text-black transition-all duration-200">Gallery</span></Link>
          <Link href="/GlobalArtIcons"><span onClick={() => setIsOpen(false)} className="block w-full md:w-auto text-center md:text-right py-2 px-4 text-black transition-all duration-200">Global Art</span></Link>
        </div>
      </div>
    </nav>
  );
}