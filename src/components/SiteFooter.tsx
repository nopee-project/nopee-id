import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
} from "react-icons/fa";

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <div className="flex justify-center gap-6 mb-6">

          <a
            href="https://instagram.com/nopee.id"
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 hover:text-[#D4B08C] transition"
          >
            <FaInstagram size={24} />
          </a>

          <a
            href="https://www.facebook.com/nopee.id.2025/"
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 hover:text-[#D4B08C] transition"
          >
            <FaFacebookF size={24} />
          </a>

          <a
            href="https://tiktok.com/@nopee.id"
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 hover:text-[#D4B08C] transition"
          >
            <FaTiktok size={22} />
          </a>

        </div>

        <div className="text-gray-500">
          © 2023 Nopee. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}