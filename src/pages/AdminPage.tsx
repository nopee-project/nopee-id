import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const categories = [
    "Fashion Wanita",
    "Fashion Pria",
    "Fashion Anak",
    "Busana Muslim",
  ];

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      fetchProducts();
    };

    checkSession();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data || []);
  };

  const saveProduct = async () => {
  try {
    if (!category) {
      alert("Pilih kategori");
      return;
    }

    let imageUrl = currentImage;

    if (imageFile) {
      // hapus gambar lama saat edit
      if (editingId && currentImage) {
        const oldImagePath = decodeURIComponent(
          currentImage.split("/product-images/")[1]
        );

        if (oldImagePath) {
          const { error: deleteError } =
            await supabase.storage
              .from("product-images")
              .remove([oldImagePath]);

          console.error(
            "DELETE OLD IMAGE ERROR:",
            deleteError
          );
        }
      }

      const fileName = `${Date.now()}-${imageFile.name}`;

      const { error: uploadError } =
        await supabase.storage
          .from("product-images")
          .upload(fileName, imageFile);

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    let error: any;

      if (editingId) {
        const result = await supabase
          .from("products")
          .update({
            name,
            price: Number(price),
            category,
            description,
            image: imageUrl,
          })
          .eq("id", editingId);

        error = result.error;
      } else {
        if (!imageFile) {
          alert("Pilih gambar terlebih dahulu");
          return;
        }

        const result = await supabase
          .from("products")
          .insert([
            {
              name,
              price: Number(price),
              category,
              description,
              image: imageUrl,
            },
          ]);

        error = result.error;
      }

      if (error) {
        alert(error.message);
        return;
      }

      fetchProducts();

      alert(
        editingId
          ? "Produk berhasil diupdate"
          : "Produk berhasil ditambahkan"
      );

      setName("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImageFile(null);

      setEditingId(null);
      setCurrentImage("");
      setPreviewImage("");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);

    setName(product.name || "");
    setPrice(String(product.price || ""));
    setCategory(product.category || "");
    setDescription(product.description || "");

    setCurrentImage(product.image || "");
    setPreviewImage("");
  };

  const deleteProduct = async (product: any) => {
    const confirmDelete = confirm(
      `Hapus ${product.name}?`
    );

    if (!confirmDelete) return;

    if (product.image) {
      const imagePath = decodeURIComponent(
        product.image.split("/product-images/")[1]
      );

      if (imagePath) {

        await supabase.storage
  .from("product-images")
  .remove([imagePath]);

      }
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchProducts();

    alert("Produk berhasil dihapus");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Dashboard Admin Nopee
          </h1>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <input
          className="w-full p-3 mb-4 rounded bg-zinc-800"
          placeholder="Nama Produk"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 rounded bg-zinc-800"
          placeholder="Harga"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          className="w-full p-3 mb-4 rounded bg-zinc-800"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Pilih Kategori</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <textarea
          className="w-full p-3 mb-4 rounded bg-zinc-800"
          placeholder="Deskripsi"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        {editingId && (
          <div className="mb-4">
            <p className="mb-2 text-zinc-400">
              Preview Gambar
            </p>

            <img
              src={previewImage || currentImage}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-xl border border-zinc-700"
            />
          </div>
        )}

        <input
          type="file"
          className="mb-6"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (!file) return;

            setImageFile(file);
            setPreviewImage(
              URL.createObjectURL(file)
            );
          }}
        />

        <button
          onClick={saveProduct}
          className="bg-[#D4B08C] text-black px-6 py-3 rounded font-semibold"
        >
          {editingId
            ? "Update Produk"
            : "Simpan Produk"}
        </button>

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">
            Daftar Produk
          </h2>

          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full p-3 mb-6 rounded bg-zinc-800"
          />

          <div className="space-y-4">
            {products
              .filter((product) =>
                product.name
                  ?.toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((product) => (
                <div
                  key={product.id}
                  className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg mb-3"
                  />

                  <h3 className="text-xl font-semibold">
                    {product.name}
                  </h3>

                  <p>
                    Rp{" "}
                    {Number(
                      product.price
                    ).toLocaleString("id-ID")}
                  </p>

                  <p className="text-zinc-400">
                    {product.category}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() =>
                        startEdit(product)
                      }
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteProduct(product)
                      }
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}