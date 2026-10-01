import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Detalhes from "./pages/Detalhes";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import MinhasPropostas from "./pages/MinhasPropostas";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLivros from "./pages/admin/AdminLivros";
import AdminNovoLivro from "./pages/admin/AdminNovoLivro";
import AdminClientes from "./pages/admin/AdminClientes";
import AdminPropostas from "./pages/admin/AdminPropostas";

function ClienteLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ClienteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/detalhes/:id" element={<Detalhes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/propostas" element={<MinhasPropostas />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="livros" element={<AdminLivros />} />
            <Route path="livros/novo" element={<AdminNovoLivro />} />
            <Route path="clientes" element={<AdminClientes />} />
            <Route path="propostas" element={<AdminPropostas />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
