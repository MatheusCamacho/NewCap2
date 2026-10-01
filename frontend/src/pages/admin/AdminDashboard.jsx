import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { API_URL } = useAuth();
  const [gerais, setGerais] = useState({ clientes: 0, livros: 0, propostas: 0 });
  const [livrosGenero, setLivrosGenero] = useState([]);
  const [clientesCidade, setClientesCidade] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/dashboard/gerais`)
      .then((r) => r.json())
      .then(setGerais);

    fetch(`${API_URL}/dashboard/livrosGenero`)
      .then((r) => r.json())
      .then(setLivrosGenero);

    fetch(`${API_URL}/dashboard/clientesCidade`)
      .then((r) => r.json())
      .then(setClientesCidade);
  }, [API_URL]);

  const dadosGraficoGenero = [
    ["Gênero", "Nº Livros"],
    ...livrosGenero.map((item) => [item.genero, item.num])
  ];

  const dadosGraficoCidade = [
    ["Cidade", "Nº Clientes"],
    ...clientesCidade.map((item) => [item.cidade, item.num])
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Visão Geral do Sistema</h2>

      <div className="flex flex-wrap justify-center gap-6 mb-8">
        <div className="border border-blue-400 rounded p-4 w-56 text-center">
          <div className="bg-blue-100 py-4 rounded text-xl font-bold mb-2">
            {gerais.clientes}
          </div>
          <p className="font-bold text-sm">Nº Clientes</p>
        </div>

        <div className="border border-red-400 rounded p-4 w-56 text-center">
          <div className="bg-red-100 py-4 rounded text-xl font-bold mb-2">
            {gerais.livros}
          </div>
          <p className="font-bold text-sm">Nº Livros</p>
        </div>

        <div className="border border-green-400 rounded p-4 w-56 text-center">
          <div className="bg-green-100 py-4 rounded text-xl font-bold mb-2">
            {gerais.propostas}
          </div>
          <p className="font-bold text-sm">Nº Propostas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-center font-bold text-red-700 mb-2">Livros por Gênero</h3>
          {livrosGenero.length > 0 && (
            <Chart
              chartType="PieChart"
              width="100%"
              height="340px"
              data={dadosGraficoGenero}
              options={{ pieHole: 0.4, legend: { position: "bottom" } }}
            />
          )}
        </div>

        <div>
          <h3 className="text-center font-bold text-red-700 mb-2">Clientes por Cidade</h3>
          {clientesCidade.length > 0 && (
            <Chart
              chartType="PieChart"
              width="100%"
              height="340px"
              data={dadosGraficoCidade}
              options={{ pieHole: 0.4, legend: { position: "bottom" } }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
