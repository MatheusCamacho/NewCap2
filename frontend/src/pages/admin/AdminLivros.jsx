import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLivros() {
  const [livros, setLivros] = useState([]);
  const { admin, API_URL } = useAuth();

  function carregarLivros() {
    fetch(`${API_URL}/livros`)
      .then((r) => r.json())
      .then((dados) => setLivros(Array.isArray(dados) ? dados : []));
  }

  useEffect(() => {
    carregarLivros();
  }, []);

  async function excluirLivro(id, titulo) {
    if (!confirm(`Confirma a exclusão do livro "${titulo}"?`)) return;

    const response = await fetch(`${API_URL}/livros/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${admin.token}` }
    });

    if (response.ok) {
      carregarLivros();
    }
  }

  async function alternarDestaque(id) {
    const response = await fetch(`${API_URL}/livros/destacar/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${admin.token}` }
    });

    if (response.ok) {
      carregarLivros();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Cadastro de Livros</h1>
        <Link
          to="/admin/livros/novo"
          className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Novo Livro
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Título do Livro</th>
              <th className="px-4 py-3">Gênero / Autor</th>
              <th className="px-4 py-3">Ano</th>
              <th className="px-4 py-3">Preço R$</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {livros.map((livro) => (
              <tr key={livro.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={livro.foto}
                    alt={livro.titulo}
                    className="w-28 h-24 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3 font-bold text-gray-900">
                  {livro.titulo}
                </td>
                <td className="px-4 py-3">
                  {livro.genero_nome} ({livro.autor})
                </td>
                <td className="px-4 py-3">{livro.ano}</td>
                <td className="px-4 py-3">
                  {Number(livro.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 space-x-3 text-xl">
                  <button
                    onClick={() => excluirLivro(livro.id, livro.titulo)}
                    title="Excluir"
                    className="text-red-600 hover:scale-110 transition"
                  >
                    ⊗
                  </button>
                  <button
                    onClick={() => alternarDestaque(livro.id)}
                    title="Destacar"
                    className={livro.destaque ? "text-yellow-500 font-bold" : "text-gray-400"}
                  >
                    ★
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
