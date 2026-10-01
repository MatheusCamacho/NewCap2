import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminPropostas() {
  const [propostas, setPropostas] = useState([]);
  const { admin, API_URL } = useAuth();

  function carregarPropostas() {
    fetch(`${API_URL}/propostas`)
      .then((r) => r.json())
      .then((dados) => setPropostas(Array.isArray(dados) ? dados : []));
  }

  useEffect(() => {
    carregarPropostas();
  }, []);

  async function responderProposta(proposta) {
    const resposta = prompt(
      `Responder proposta de ${proposta.cliente_nome} para "${proposta.livro_titulo}":`,
      proposta.resposta || ""
    );
    if (!resposta || resposta.trim() === "") return;

    const response = await fetch(`${API_URL}/propostas/${proposta.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${admin.token}`
      },
      body: JSON.stringify({ resposta })
    });

    if (response.ok) {
      carregarPropostas();
    }
  }

  async function excluirProposta(id) {
    if (!confirm("Confirma a exclusão desta proposta?")) return;

    const response = await fetch(`${API_URL}/propostas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${admin.token}` }
    });

    if (response.ok) {
      carregarPropostas();
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Controle de Propostas</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">Foto do Livro</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Preço R$</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Proposta do Cliente</th>
              <th className="px-4 py-3">Resposta da Livraria</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {propostas.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={p.livro_foto}
                    alt={p.livro_titulo}
                    className="w-24 h-20 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{p.livro_titulo}</td>
                <td className="px-4 py-3">
                  {Number(p.livro_preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3">{p.cliente_nome}</td>
                <td className="px-4 py-3">{p.descricao}</td>
                <td className="px-4 py-3">{p.resposta || ""}</td>
                <td className="px-4 py-3">
                  {p.resposta ? (
                    <span className="text-green-600 text-2xl font-bold">✓</span>
                  ) : (
                    <div className="flex flex-col gap-1 text-xl">
                      <button
                        onClick={() => excluirProposta(p.id)}
                        className="text-red-600"
                        title="Excluir Proposta"
                      >
                        ⊗
                      </button>
                      <button
                        onClick={() => responderProposta(p)}
                        className="text-amber-600"
                        title="Responder Proposta"
                      >
                        📝
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
