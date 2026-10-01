import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { logarCliente, API_URL } = useAuth();
  const navigate = useNavigate();

  async function verificaLogin(data) {
    const response = await fetch(`${API_URL}/clientes/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, senha: data.senha })
    });

    if (response.status === 200) {
      const dados = await response.json();
      logarCliente(dados, data.manter);
      navigate("/");
    } else {
      alert("Erro... E-mail ou senha inválidos");
    }
  }

  return (
    <section className="max-w-md mx-auto mt-14 bg-white p-8 border border-gray-200 rounded-xl shadow">
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl mb-6">
        Dados de Acesso do Cliente
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit(verificaLogin)}>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Seu e-mail
          </label>
          <input
            type="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
            required
            {...register("email")}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Senha de Acesso
          </label>
          <input
            type="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
            required
            {...register("senha")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="manter"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50"
                {...register("manter")}
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="manter" className="text-gray-600">
                Manter Conectado
              </label>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700 hover:underline cursor-pointer">
            Esqueceu sua senha?
          </span>
        </div>

        <button
          type="submit"
          className="w-full text-white bg-orange-600 hover:bg-orange-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Entrar
        </button>

        <p className="text-sm font-light text-gray-500">
          Ainda não possui conta?{" "}
          <Link to="/cadastro" className="font-medium text-gray-800 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </section>
  );
}
