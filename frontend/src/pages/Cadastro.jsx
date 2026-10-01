import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Cadastro() {
  const { register, handleSubmit } = useForm();
  const { logarCliente, API_URL } = useAuth();
  const navigate = useNavigate();

  async function cadastrar(data) {
    const response = await fetch(`${API_URL}/clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.status === 201) {
      const novoCliente = await response.json();
      logarCliente(novoCliente, true);
      navigate("/");
    } else {
      alert("Não foi possível realizar o cadastro. Verifique os dados.");
    }
  }

  return (
    <section className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-200 rounded-xl shadow">
      <h1 className="text-xl font-bold text-gray-900 md:text-2xl mb-6">
        Cadastro de Novo Cliente
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit(cadastrar)}>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-900">Nome Completo</label>
          <input
            type="text"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
            {...register("nome")}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-900">E-mail</label>
          <input
            type="email"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
            {...register("email")}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-900">Cidade</label>
          <input
            type="text"
            placeholder="Ex: Pelotas, Rio Grande, Bagé..."
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
            {...register("cidade")}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-900">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
            {...register("senha")}
          />
        </div>

        <button
          type="submit"
          className="w-full text-white bg-orange-600 hover:bg-orange-700 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Criar Conta
        </button>

        <p className="text-sm text-gray-500">
          Já possui cadastro?{" "}
          <Link to="/login" className="font-medium text-gray-800 hover:underline">
            Faça Login
          </Link>
        </p>
      </form>
    </section>
  );
}
