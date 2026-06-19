export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "20px",
          borderBottom: "1px solid #222",
        }}
      >
        <h2>NOPEE</h2>
      </header>

      <section
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "4rem",
            marginBottom: "10px",
          }}
        >
          Premium Fashion Catalog
        </h1>

        <p
          style={{
            color: "#999",
            maxWidth: "500px",
          }}
        >
          Koleksi fashion premium untuk pria, wanita,
          anak dan busana muslim.
        </p>

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            gap: "12px",
          }}
        >
          <button>Lihat Koleksi</button>
          <button>WhatsApp</button>
        </div>
      </section>
    </main>
  );
}