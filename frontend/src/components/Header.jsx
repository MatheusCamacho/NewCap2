import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { cliente, deslogarCliente } = useAuth();
  const navigate = useNavigate();

  function sair() {
    if (confirm("Confirma a saída do sistema?")) {
      deslogarCliente();
      navigate("/");
    }
  }

  return (
    <nav className="bg-amber-600 border-gray-200 shadow-md">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        <Link to="/" className="flex items-center space-x-3">
          <span className="text-3xl">📚</span>
          <span className="self-center text-2xl font-bold whitespace-nowrap text-white">
            Livraria Capítulo 2
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {cliente ? (
            <div className="flex items-center gap-3">
              <span className="text-white font-medium">{cliente.nome}</span>
              <Link
                to="/propostas"
                className="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg text-sm px-4 py-2 transition"
              >
                Minhas Propostas
              </Link>
              <button
                onClick={sair}
                className="text-white underline hover:text-gray-200 text-sm font-medium"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-blue-950 bg-white/90 hover:bg-white px-4 py-2 rounded-lg text-sm font-semibold underline"
              >
                Identifique-se
              </Link>
              <Link
                to="/admin/login"
                className="text-amber-100 hover:text-white text-xs underline"
              >
                Área Admin
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
