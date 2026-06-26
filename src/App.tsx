import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/products"
          element={<ProductsPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/admin"
          element={<AdminPage />}
        />

        <Route
          path="/product/:slug"
          element={<ProductDetailPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;