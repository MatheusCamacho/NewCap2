import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminNovoLivro() {
  const { register, handleSubmit } = useForm();
  const [generos, setGeneros] = useState([]);
  const { admin, API_URL } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/generos`)
      .then((r) => r.json())
      .then(setGeneros);
  }, [API_URL]);

  async function salvarLivro(data) {
    const response = await fetch(`${API_URL}/livros`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${admin.token}`
      },
      body: JSON.stringify(data)
    });

    if (response.status === 201) {
      alert("Livro cadastrado com sucesso!");
      navigate("/admin/livros");
    } else {
      alert("Erro ao cadastrar livro.");
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Inclusão de Novo Livro</h1>

      <form onSubmit={handleSubmit(salvarLivro)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título do Livro</label>
          <input
            type="text"
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg"
            {...register("titulo")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Autor(a)</label>
            <input
              type="text"
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg"
              {...register("autor")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gênero Literário</label>
            <select
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
              {...register("genero_id")}
            >
              {generos.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ano</label>
            <input
              type="number"
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg"
              {...register("ano")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Preço R$</label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg"
              {...register("preco")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nº de Páginas</label>
            <input
              type="number"
              defaultValue={280}
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg"
              {...register("paginas")}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL da Foto da Capa</label>
          <input
            type="url"
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg"
            {...register("foto")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Acabamento / Conservação</label>
          <input
            type="text"
            placeholder="Ex: Capa Dura, Brochura, Edição Comentada..."
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg"
            {...register("conservacao")}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-6 py-2.5"
        >
          Salvar Livro
        </button>
      </form>
    </div>
  );
}
