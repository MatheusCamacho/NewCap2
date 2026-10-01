import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { register, handleSubmit } = useForm();
  const { logarAdmin, API_URL } = useAuth();
  const navigate = useNavigate();

  async function efetuaLogin(data) {
    const response = await fetch(`${API_URL}/admins/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.status === 200) {
      const dados = await response.json();
      logarAdmin(dados);
      navigate("/admin");
    } else {
      alert("Erro: E-mail ou senha de administrador inválidos.");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 bg-white rounded-lg shadow border border-gray-200">
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">📚</div>
        <h1 className="text-2xl font-bold text-gray-900">
          Admin: Livraria Capítulo 2
        </h1>
      </div>

      <form onSubmit={handleSubmit(efetuaLogin)} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-900">E-mail:</label>
          <input
            type="email"
            defaultValue="admin@capitulo2.com"
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
            {...register("email")}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-900">Senha:</label>
          <input
            type="password"
            defaultValue="123456"
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
            {...register("senha")}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-6 py-2.5"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
