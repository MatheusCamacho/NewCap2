import { Link } from "react-router-dom";

export default function CardLivro({ livro }) {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between">
      <img
        className="rounded-t-lg h-64 w-full object-cover"
        src={livro.foto}
        alt={livro.titulo}
      />
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h5 className="mb-1 text-xl font-bold tracking-tight text-gray-900">
            {livro.titulo}
          </h5>
          <p className="mb-2 text-sm font-medium text-amber-700">
            {livro.autor} • {livro.genero_nome}
          </p>
          <p className="mb-2 font-extrabold text-gray-900">
            Preço R$: {Number(livro.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
          </p>
          <p className="mb-4 text-sm text-gray-600">
            Ano: {livro.ano} - {livro.paginas} págs.
          </p>
        </div>
        <Link
          to={`/detalhes/${livro.id}`}
          className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 w-fit"
        >
          Ver Detalhes
          <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
