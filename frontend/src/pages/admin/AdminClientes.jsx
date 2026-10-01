import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const { admin, API_URL } = useAuth();

  function carregarClientes() {
    fetch(`${API_URL}/clientes`, {
      headers: { Authorization: `Bearer ${admin.token}` }
    })
      .then((r) => r.json())
      .then((dados) => setClientes(Array.isArray(dados) ? dados : []));
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  async function removerCliente(id, nome) {
    if (!confirm(`Deseja remover o cliente "${nome}"?`)) return;

    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${admin.token}` }
    });

    if (response.ok) {
      carregarClientes();
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Controle de Clientes</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Cidade</th>
              <th className="px-4 py-3">Propostas</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{c.nome}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.cidade}</td>
                <td className="px-4 py-3">{c.total_propostas}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => removerCliente(c.id, c.nome)}
                    className="text-red-600 text-lg font-bold"
                    title="Excluir Cliente"
                  >
                    ⊗
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
