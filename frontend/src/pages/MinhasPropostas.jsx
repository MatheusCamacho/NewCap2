import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function MinhasPropostas() {
  const { cliente, API_URL } = useAuth();
  const [propostas, setPropostas] = useState([]);

  useEffect(() => {
    if (cliente) {
      fetch(`${API_URL}/propostas/cliente/${cliente.id}`)
        .then((res) => res.json())
        .then((dados) => setPropostas(Array.isArray(dados) ? dados : []));
    }
  }, [cliente, API_URL]);

  function dataDMA(data) {
    const d = new Date(data);
    return d.toLocaleDateString("pt-br");
  }

  return (
    <section className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="mb-6 text-3xl font-extrabold text-gray-900">
        Listagem de <span className="underline underline-offset-4 decoration-8 decoration-amber-500">Minhas Propostas</span>
      </h1>

      {propostas.length === 0 ? (
        <h2 className="text-lg text-gray-600 mt-8">
          Você ainda não fez propostas para os nossos livros.
        </h2>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">Livro</th>
                <th className="px-6 py-3">Foto</th>
                <th className="px-6 py-3">Proposta</th>
                <th className="px-6 py-3">Resposta</th>
              </tr>
            </thead>
            <tbody>
              {propostas.map((p) => (
                <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <p className="font-bold text-base">{p.livro_titulo}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Ano: {p.livro_ano} - R$: {Number(p.livro_preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src={p.livro_foto}
                      alt={p.livro_titulo}
                      className="w-20 h-24 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{p.descricao}</p>
                    <p className="italic text-xs text-gray-500 mt-1">
                      Enviado em: {dataDMA(p.created_at)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {p.resposta ? (
                      <span className="font-semibold text-green-700">{p.resposta}</span>
                    ) : (
                      <span className="italic text-gray-500">Aguardando...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
