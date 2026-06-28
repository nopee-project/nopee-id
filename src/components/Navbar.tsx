import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

import logo from "../assets/logo-nopee.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinkClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `transition ${
      isActive
        ? "text-[#D4B08C]"
        : "hover:text-[#D4B08C]"
    }`;

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [menuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen
      ? "hidden"
      : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/">
          <img
            src={logo}
            alt="Nopee"
            className="h-16 md:h-20 w-auto"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-10 text-sm">

          <NavLink
            to="/"
            className={navLinkClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={navLinkClass}
          >
            Products
          </NavLink>

          <a
            href="https://wa.me/6287887978989"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#D4B08C] transition"
          >
            WhatsApp
          </a>

        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
        >
          {menuOpen ? (
            <X size={30} />
          ) : (
            <Menu size={30} />
          )}
        </button>
      </div>

      {/* Dark Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`
          absolute
          top-full
          left-0
          w-full
          bg-black
          border-t
          border-zinc-800
          md:hidden
          overflow-hidden
          transition-all
          duration-300
          z-50
          ${
            menuOpen
              ? "max-h-[700px] opacity-100"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <nav
          className="flex flex-col px-6 pt-6 pb-8 text-lg"
          style={{
            paddingBottom:
              "calc(env(safe-area-inset-bottom) + 2rem)",
          }}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${navLinkClass({
                isActive,
              })} py-2`
            }
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `${navLinkClass({
                isActive,
              })} py-2 mt-3`
            }
            onClick={() => setMenuOpen(false)}
          >
            Products
          </NavLink>

          <div className="border-t border-zinc-800 my-6" />

          <p className="text-sm text-zinc-500 uppercase tracking-wider mb-3">
            Categories
          </p>

          <div className="flex flex-col ml-5">

            <NavLink
              to="/category/fashion-wanita"
              className={({ isActive }) =>
                `${navLinkClass({
                  isActive,
                })} py-2`
              }
              onClick={() => setMenuOpen(false)}
            >
              Fashion Wanita
            </NavLink>

            <NavLink
              to="/category/fashion-pria"
              className={({ isActive }) =>
                `${navLinkClass({
                  isActive,
                })} py-2`
              }
              onClick={() => setMenuOpen(false)}
            >
              Fashion Pria
            </NavLink>

            <NavLink
              to="/category/fashion-anak"
              className={({ isActive }) =>
                `${navLinkClass({
                  isActive,
                })} py-2`
              }
              onClick={() => setMenuOpen(false)}
            >
              Fashion Anak
            </NavLink>

            <NavLink
              to="/category/busana-muslim"
              className={({ isActive }) =>
                `${navLinkClass({
                  isActive,
                })} py-2`
              }
              onClick={() => setMenuOpen(false)}
            >
              Busana Muslim
            </NavLink>

          </div>

          <div className="border-t border-zinc-800 my-6" />

          <a
            href="https://wa.me/6287887978989"
            target="_blank"
            rel="noreferrer"
            className="py-2 hover:text-[#D4B08C] transition"
          >
            WhatsApp
          </a>

        </nav>
      </div>
    </header>
  );
}

