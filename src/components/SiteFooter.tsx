import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
  FaDiscord,
  FaTelegram,
} from "react-icons/fa";

import { SiShopee, SiX } from "react-icons/si";

type SocialLink = {
  id: number;
  name: string;
  url: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
};

export default function SiteFooter() {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) {
      console.error(error);
      return;
    }

    setLinks(data || []);
  }

  const icons: Record<string, React.ReactElement> = {
    instagram: <FaInstagram size={24} />,
    facebook: <FaFacebookF size={24} />,
    tiktok: <FaTiktok size={22} />,
    whatsapp: <FaWhatsapp size={24} />,
    youtube: <FaYoutube size={24} />,
    discord: <FaDiscord size={24} />,
    telegram: <FaTelegram size={24} />,
    shopee: <SiShopee size={24} />,
    x: <SiX size={24} />,
  };

  return (
    <footer className="border-t border-zinc-800 py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex justify-center gap-6 mb-6">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-[#D4B08C] transition"
              title={link.name}
            >
              {icons[link.icon.toLowerCase()] ?? (
                <span className="text-sm font-bold">{link.name.charAt(0)}</span>
              )}
            </a>
          ))}
        </div>

        <div className="text-gray-500">© 2023 Nopee. All Rights Reserved.</div>
      </div>
    </footer>
  );
}
