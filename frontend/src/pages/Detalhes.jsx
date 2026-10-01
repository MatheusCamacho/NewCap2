import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

export default function Detalhes() {
  const { id } = useParams();
  const { cliente, API_URL } = useAuth();
  const [livro, setLivro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    setCarregando(true);
    fetch(`${API_URL}/livros/${id}`)
      .then((res) => res.json())
      .then((dados) => {
        setLivro(dados);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, [id, API_URL]);

  async function enviaProposta(data) {
    if (!data.descricao || data.descricao.trim().length < 5) {
      alert("Descreva sua proposta para o livro.");
      return;
    }

    const response = await fetch(`${API_URL}/propostas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente_id: cliente.id,
        livro_id: Number(id),
        descricao: data.descricao
      })
    });

    if (response.status === 201) {
      alert("Obrigado. Sua proposta foi enviada. Aguarde retorno da livraria.");
      reset();
    } else {
      alert("Erro... Não foi possível enviar sua proposta.");
    }
  }

  if (carregando) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 text-center text-gray-600">
        Carregando detalhes e consultando sinopse...
      </div>
    );
  }

  if (!livro || livro.erro) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 text-center">
        <p className="text-xl text-red-600">Livro não encontrado.</p>
        <Link to="/" className="text-blue-600 underline mt-4 inline-block">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
      <img
        className="w-full max-h-[420px] object-cover"
        src={livro.foto}
        alt={livro.titulo}
      />

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {livro.titulo} ({livro.ano}) - {livro.genero_nome} ({livro.paginas} págs.)
        </h2>

        <p className="text-xl text-gray-800 mb-2">
          Preço R$: {Number(livro.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
        </p>

        <p className="italic text-gray-600 mb-4">
          Autor(a): {livro.autor} • {livro.conservacao}
        </p>

        {livro.dadosIA && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h3 className="font-bold text-gray-900 mb-1">
              Sinopse da Obra: <span className="text-red-600">*</span>
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {livro.dadosIA.sinopse}
            </p>

            <h3 className="font-bold text-gray-900 mb-1">
              Pontos Fortes: <span className="text-red-600">*</span>
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-700 mb-4 space-y-1">
              {livro.dadosIA.pontosFortes?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <h3 className="font-bold text-gray-900 mb-1">
              Aspectos da Narrativa: <span className="text-red-600">*</span>
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-700 mb-4 space-y-1">
              {livro.dadosIA.pontosAtencao?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <p className="text-sm font-bold text-gray-900">
              Tempo Médio de Leitura: {livro.dadosIA.tempoCidade} <span className="text-red-600">*</span>
            </p>
            <p className="text-sm font-bold text-gray-900 mb-3">
              Perfil Recomendado: {livro.dadosIA.publico} <span className="text-red-600">*</span>
            </p>

            <p className="text-xs italic text-gray-500">
              <span className="text-red-600 font-bold">*</span> Informações geradas por IA. Sujeito a erros.
            </p>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-gray-200">
          {cliente ? (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                🙂 Você pode fazer uma Proposta para este livro!
              </h3>
              <form onSubmit={handleSubmit(enviaProposta)} className="space-y-3">
                <input
                  type="text"
                  disabled
                  value={`${cliente.nome} (${cliente.email})`}
                  className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed"
                />
                <textarea
                  rows="3"
                  placeholder="Escreva sua proposta de compra, reserva ou troca..."
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  {...register("descricao")}
                  required
                ></textarea>
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Enviar Proposta
                </button>
              </form>
            </div>
          ) : (
            <h3 className="text-lg font-bold text-gray-800">
              😎 Gostou?{" "}
              <Link to="/login" className="text-blue-700 underline">
                Identifique-se
              </Link>{" "}
              e faça uma Proposta!
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}
