import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

export default function InputPesquisa({ setLivros }) {
  const { register, handleSubmit, reset } = useForm();
  const { API_URL } = useAuth();

  async function enviaPesquisa(data) {
    if (!data.termo || data.termo.trim().length < 2) {
      alert("Informe, no mínimo, 2 caracteres para a pesquisa");
      return;
    }
    const response = await fetch(`${API_URL}/livros/pesquisa/${encodeURIComponent(data.termo.trim())}`);
    const dados = await response.json();
    setLivros(dados);
  }

  async function mostraDestaques() {
    const response = await fetch(`${API_URL}/livros/destaques`);
    const dados = await response.json();
    reset({ termo: "" });
    setLivros(dados);
  }

  return (
    <div className="flex max-w-5xl mx-auto mt-6 px-4 gap-3 items-center">
      <form className="flex-1" onSubmit={handleSubmit(enviaPesquisa)}>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-3.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Título, autor, gênero, ano ou preço máximo"
            {...register("termo")}
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-1.5"
          >
            Pesquisar
          </button>
        </div>
      </form>

      <button
        type="button"
        onClick={mostraDestaques}
        className="p-3 text-sm font-medium text-white bg-purple-700 rounded-lg hover:bg-purple-800 whitespace-nowrap"
      >
        Exibir Destaques
      </button>
    </div>
  );
}
