import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3004";

export function AuthProvider({ children }) {
  const [cliente, setCliente] = useState(null);
  const [admin, setAdmin] = useState(() => {
    const salvo = localStorage.getItem("adminKey");
    return salvo ? JSON.parse(salvo) : null;
  });

  useEffect(() => {
    const idSalvo = localStorage.getItem("clienteKey") || sessionStorage.getItem("clienteKey");
    if (idSalvo) {
      fetch(`${API_URL}/clientes/${idSalvo}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((dados) => {
          if (dados && dados.id) {
            setCliente(dados);
          }
        })
        .catch(() => {});
    }
  }, []);

  function logarCliente(dadosCliente, manterConectado) {
    setCliente(dadosCliente);
    if (manterConectado) {
      localStorage.setItem("clienteKey", dadosCliente.id);
    } else {
      sessionStorage.setItem("clienteKey", dadosCliente.id);
    }
  }

  function deslogarCliente() {
    setCliente(null);
    localStorage.removeItem("clienteKey");
    sessionStorage.removeItem("clienteKey");
  }

  function logarAdmin(dadosAdmin) {
    setAdmin(dadosAdmin);
    localStorage.setItem("adminKey", JSON.stringify(dadosAdmin));
  }

  function deslogarAdmin() {
    setAdmin(null);
    localStorage.removeItem("adminKey");
  }

  return (
    <AuthContext.Provider
      value={{
        cliente,
        logarCliente,
        deslogarCliente,
        admin,
        logarAdmin,
        deslogarAdmin,
        API_URL
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
