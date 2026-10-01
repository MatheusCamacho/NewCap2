import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import InputPesquisa from "../components/InputPesquisa";
import CardLivro from "../components/CardLivro";

export default function Home() {
  const [livros, setLivros] = useState([]);
  const { API_URL } = useAuth();

  useEffect(() => {
    fetch(`${API_URL}/livros/destaques`)
      .then((res) => res.json())
      .then((dados) => setLivros(Array.isArray(dados) ? dados : []))
      .catch(() => {});
  }, [API_URL]);

  return (
    <div>
      <InputPesquisa setLivros={setLivros} />

      <div className="max-w-screen-xl mx-auto px-4 mt-6 mb-12">
        <h1 className="mb-6 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl">
          Livros <span className="underline underline-offset-4 decoration-8 decoration-amber-500">em destaque</span>
        </h1>

        {livros.length === 0 ? (
          <p className="text-gray-600 text-lg mt-6">
            Nenhum livro encontrado para a pesquisa realizada.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {livros.map((livro) => (
              <CardLivro key={livro.id} livro={livro} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
