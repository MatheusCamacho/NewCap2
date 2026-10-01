import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { admin, deslogarAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);

  function sair() {
    if (confirm("Confirma a saída da área administrativa?")) {
      deslogarAdmin();
      navigate("/");
    }
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-500 text-white flex justify-between items-center px-6 py-4 shadow">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📚</span>
          <span className="text-2xl font-semibold">Livraria Capítulo 2: Admin</span>
        </div>
        <div className="flex items-center gap-2 font-medium">
          <span>👤 {admin.nome}</span>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-60 bg-blue-200 p-4 space-y-3 font-medium text-gray-900">
          <Link to="/admin" className="flex items-center gap-2 p-2 rounded hover:bg-blue-300">
            <span>📊</span> Visão Geral
          </Link>
          <Link to="/admin/livros" className="flex items-center gap-2 p-2 rounded hover:bg-blue-300">
            <span>📖</span> Cadastro de Livros
          </Link>
          <Link to="/admin/clientes" className="flex items-center gap-2 p-2 rounded hover:bg-blue-300">
            <span>👥</span> Controle de Clientes
          </Link>
          <Link to="/admin/propostas" className="flex items-center gap-2 p-2 rounded hover:bg-blue-300">
            <span>💬</span> Controle de Propostas
          </Link>
          <button
            onClick={sair}
            className="w-full text-left flex items-center gap-2 p-2 rounded hover:bg-blue-300"
          >
            <span>🚪</span> Sair do Sistema
          </button>
        </aside>

        <main className="flex-1 p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
