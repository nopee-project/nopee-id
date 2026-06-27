import logo from "../assets/logo-nopee.png";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
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

          <nav className="hidden md:flex gap-10 text-sm">
           
           <NavLink
  to="/"
  className={({ isActive }) =>
    `transition ${
      isActive
        ? "text-[#D4B08C]"
        : "hover:text-[#D4B08C]"
    }`
  }
>
  Home
</NavLink>

           <NavLink
  to="/products"
  className={({ isActive }) =>
    `transition ${
      isActive
        ? "text-[#D4B08C]"
        : "hover:text-[#D4B08C]"
    }`
  }
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
        </div>
    </header>

  );
}