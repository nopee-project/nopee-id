import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const formatPrice = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "");

    return numbersOnly.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        "."
    );
  };
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showForm, setShowForm] = useState(false);

  const formRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const logoutTimer = useRef<number | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const [showCategoryManager, setShowCategoryManager] = useState(false);
  

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
      fetchCategories();
    };

    checkSession();
  }, []);

  useEffect(() => {
  const events = [
    "mousemove",
    "mousedown",
    "keypress",
    "scroll",
    "touchstart",
  ];

  resetLogoutTimer();

  events.forEach((event) => {
    window.addEventListener(
      event,
      resetLogoutTimer
    );
  });

  return () => {
    events.forEach((event) => {
      window.removeEventListener(
        event,
        resetLogoutTimer
      );
    });

    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
  };
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

  const fetchCategories = async () => {
  const { data, error } =
    await supabase
      .from("categories")
      .select("*")
      .order("name");

  if (error) {
    console.error(error);
    return;
  }

  setCategories(data || []);
};

const addCategory = async () => {
  const categoryName = newCategory.trim();

  const existing = categories.find(
  (item) =>
    item.name.toLowerCase() ===
    categoryName.toLowerCase()
);

if (existing) {
  alert("Kategori sudah ada");
  return;
}

  if (!categoryName) return;

  const { error } = await supabase
    .from("categories")
    .insert([
      {
        name: categoryName,
      },
    ]);

  if (error) {
    alert(error.message);
    return;
  }

  setCategory(categoryName);

  setNewCategory("");

  await fetchCategories();

  alert("Kategori berhasil ditambahkan");
};

const deleteCategory = async (
  categoryItem: any
) => {

  const { count } = await supabase
    .from("products")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("category", categoryItem.name);

  if ((count || 0) > 0) {
    alert(
      "Ada produk dalam kategori ini, pindahkan ke kategori lain terlebih dahulu."
    );
    return;
  }

  const confirmDelete = confirm(
    `Hapus kategori "${categoryItem.name}" ?`
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryItem.id);

  if (error) {
    alert(error.message);
    return;
  }

  fetchCategories();

  alert("Kategori berhasil dihapus");
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
            price: Number(
  price.replace(/\./g, "")
),
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
              price: Number(
  price.replace(/\./g, "")
),
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
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  const startEdit = (product: any) => {
  setEditingId(product.id);
  setShowForm(true);

  setTimeout(() => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    nameInputRef.current?.focus();
  }, 100);

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

  const resetLogoutTimer = () => {
  if (logoutTimer.current) {
    clearTimeout(logoutTimer.current);
  }

  logoutTimer.current = window.setTimeout(
    async () => {
      alert(
        "Session berakhir karena tidak ada aktivitas selama 10 menit"
      );

      await supabase.auth.signOut();

      window.location.href = "/login";
    },
    10 * 60 * 1000
  );
};

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

const filteredProducts = products
  .filter((product) =>
    product.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  )
  .sort((a, b) => {
    let result = 0;

    if (sortField === "name") {
      result = a.name.localeCompare(b.name);
    }

    if (sortField === "price") {
      result = a.price - b.price;
    }

    if (sortField === "category") {
      result = a.category.localeCompare(
        b.category
      );
    }

    if (sortField === "created_at") {
        result =
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime();
    }

    return sortDirection === "asc"
      ? result
      : -result;
  });

  const totalPages = Math.ceil(
  filteredProducts.length / itemsPerPage
);

const paginatedProducts = filteredProducts.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);


  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">
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

        <button
  onClick={() => setShowForm(!showForm)}
  className="
    w-full
    mb-6
    bg-zinc-900
    border
    border-zinc-700
    rounded-xl
    py-4
    font-semibold
    hover:border-[#D4B08C]
    transition
  "
>
  {showForm
    ? "Tutup Form Produk"
    : "+ Tambah Produk"}
</button>

{showForm && (
  <div ref={formRef}>
        <input
            ref={nameInputRef}
            className="w-full p-3 mb-4 rounded bg-zinc-800"
            placeholder="Nama Produk"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />

       <input
  className="w-full p-3 mb-4 rounded bg-zinc-800"
  placeholder="Harga"
  value={price}
  onChange={(e) =>
  setPrice(
    formatPrice(e.target.value)
  )
}
/>

<button
  onClick={() =>
    setShowCategoryManager(true)
  }
  className="
    mb-4
    bg-zinc-700
    px-4
    py-3
    rounded
  "
>
  Kelola Kategori
</button>

<select
  className="w-full p-3 mb-4 rounded bg-zinc-800"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="">
    Pilih Kategori
  </option>

  {categories.map((item) => (
    <option
      key={item.id}
      value={item.name}
    >
      {item.name}
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

        <div className="flex items-center gap-4 mb-6">
  <label
    htmlFor="image-upload"
    className="
      w-56
      text-center
      bg-[#D4B08C]
      text-black
      py-3
      rounded
      font-semibold
      cursor-pointer
      hover:opacity-90
    "
  >
    Pilih Gambar
  </label>

  <span className="text-zinc-400">
    {imageFile
      ? imageFile.name
      : "Belum ada file dipilih"}
  </span>

  <input
    id="image-upload"
    type="file"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0];

      if (!file) return;

      setImageFile(file);

      setPreviewImage(
        URL.createObjectURL(file)
      );
    }}
  />
</div>

<button
  onClick={saveProduct}
  className="
    w-56
    bg-[#D4B08C]
    text-black
    py-3
    rounded
    font-semibold
    hover:opacity-90
  "
>
  {editingId
    ? "Update Produk"
    : "Simpan Produk"}
</button>

          </div>
)}

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">
            Daftar Produk
          </h2>

          <div className="flex justify-between items-center gap-4 mb-6">
  <input
    type="text"
    placeholder="Cari produk..."
    value={search}
    onChange={(e) => {
  setSearch(e.target.value);
  setCurrentPage(1);
}}
    className="flex-1 p-3 rounded bg-zinc-800"
  />

  <select
  value={`${sortField}-${sortDirection}`}
  onChange={(e) => {
    const [field, direction] =
      e.target.value.split("-");

    setSortField(field);
    setSortDirection(direction);
  }}
  className="p-3 rounded bg-zinc-800"
>
  <option value="created_at-desc">
    Terbaru
  </option>

  <option value="created_at-asc">
    Terlama
  </option>

  <option value="name-asc">
    Nama A-Z
  </option>

  <option value="name-desc">
    Nama Z-A
  </option>

  <option value="price-asc">
    Harga Termurah
  </option>

  <option value="price-desc">
    Harga Termahal
  </option>
</select>

<select
  value={itemsPerPage}
  onChange={(e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }}
  className="p-3 rounded bg-zinc-800"
>
  <option value={10}>10</option>
  <option value={25}>25</option>
  <option value={50}>50</option>
</select>

</div>

          <div className="overflow-x-auto">
  <table className="w-full border-collapse">
    <thead>
        <tr className="border-b border-zinc-700 text-left">
            <th className="p-3 w-16">No</th>
            <th className="p-3">Foto</th>
            <th className="p-3">Nama Produk</th>
            <th className="p-3">Kategori</th>
            <th className="p-3 text-right">Harga</th>
            <th className="p-3">Aksi</th>
        </tr>
    </thead>

    <tbody>
      {paginatedProducts.map((product, index) => (
          <tr
            key={product.id}
            className="border-b border-zinc-800 hover:bg-zinc-900"
          >
            <td className="p-3 text-zinc-400">
                {(currentPage - 1) * itemsPerPage + index + 1}
            </td>

            <td className="p-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-lg"
              />
            </td>

            <td className="p-3 font-medium whitespace-nowrap">
                {product.name}
            </td>

            <td className="p-3 text-zinc-400 whitespace-nowrap">
                {product.category}
            </td>

            <td className="p-3 text-right whitespace-nowrap font-medium">
                Rp {Number(product.price).toLocaleString("id-ID")}
            </td>

            <td className="p-3">
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(product)}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(product)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        ))}
    </tbody>
  </table>

  <div className="mt-4 text-sm text-zinc-400">
  Menampilkan {paginatedProducts.length} dari{" "}
  {filteredProducts.length} produk
</div>

<div className="flex justify-center gap-2 mt-6">
  <button
    onClick={() =>
      setCurrentPage((prev) =>
        Math.max(prev - 1, 1)
      )
    }
    disabled={currentPage === 1}
    className="
      px-4 py-2 rounded
      bg-zinc-800
      disabled:opacity-40
    "
  >
    Prev
  </button>

  {Array.from(
    { length: totalPages },
    (_, i) => i + 1
  ).map((page) => (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={`
        px-4 py-2 rounded
        ${
          currentPage === page
            ? "bg-[#D4B08C] text-black"
            : "bg-zinc-800"
        }
      `}
    >
      {page}
    </button>
  ))}

  <button
    onClick={() =>
      setCurrentPage((prev) =>
        Math.min(prev + 1, totalPages)
      )
    }
    disabled={currentPage === totalPages}
    className="
      px-4 py-2 rounded
      bg-zinc-800
      disabled:opacity-40
    "
  >
    Next
  </button>
</div>

</div>

{showCategoryManager && (
  <div
    className="
      fixed inset-0
      bg-black/70
      flex items-center justify-center
      z-50
    "
  >
    <div
      className="
        bg-zinc-900
        p-6
        rounded-xl
        w-full
        max-w-lg
        border border-zinc-700
      "
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 mb-4">
  <input
    type="text"
    placeholder="Kategori baru"
    value={newCategory}
    onChange={(e) =>
      setNewCategory(e.target.value)
    }
    className="
      flex-1
      p-3
      rounded
      bg-zinc-800
    "
  />

  <button
    onClick={addCategory}
    className="
      bg-[#D4B08C]
      text-black
      px-4
      rounded
      font-semibold
    "
  >
    Tambah
  </button>
</div>
        {/* <h3 className="text-xl font-bold"> Kelola Kategori </h3> */}

        <button
          onClick={() =>
            setShowCategoryManager(false)
          }
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {categories.map((item) => (
          <div
            key={item.id}
            className="
              flex justify-between items-center
              bg-zinc-800
              px-3 py-2
              rounded
            "
          >
            <span>{item.name}</span>

            <button
              onClick={() =>
                deleteCategory(item)
              }
              className="
                bg-red-600
                px-3 py-1
                rounded
              "
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
}