import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AdminSettingsModal({
  open,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    whatsapp: "",
    instagram: "",
    facebook: "",
    tiktok: "",
  });

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  async function loadSettings() {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setSettings({
      whatsapp: data.whatsapp || "",
      instagram: data.instagram || "",
      facebook: data.facebook || "",
      tiktok: data.tiktok || "",
    });
  }

  async function saveSettings() {
    setLoading(true);

    const { error } = await supabase
      .from("settings")
      .update(settings)
      .eq("id", 2);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Pengaturan berhasil disimpan");

    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-xl p-8">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            Pengaturan Website
          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">

          <div>
            <label className="block mb-2">
              WhatsApp
            </label>

            <input
              className="w-full p-3 rounded bg-zinc-800"
              value={settings.whatsapp}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  whatsapp: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2">
              Instagram
            </label>

            <input
              className="w-full p-3 rounded bg-zinc-800"
              value={settings.instagram}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  instagram: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2">
              Facebook
            </label>

            <input
              className="w-full p-3 rounded bg-zinc-800"
              value={settings.facebook}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  facebook: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2">
              TikTok
            </label>

            <input
              className="w-full p-3 rounded bg-zinc-800"
              value={settings.tiktok}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  tiktok: e.target.value,
                })
              }
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded bg-zinc-700"
          >
            Batal
          </button>

          <button
            onClick={saveSettings}
            disabled={loading}
            className="px-6 py-3 rounded bg-[#D4B08C] text-black font-semibold"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>

        </div>

      </div>
    </div>
  );
}