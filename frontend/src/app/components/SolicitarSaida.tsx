import { useState } from "react";
import api from "../api/api";

function SolicitarSaida() {

  const [matricula, setMatricula] = useState("");

  const solicitar = async () => {
    await api.post("/alunos/solicitar", { matricula });
  };

  return (
    <div>
      <h1>Solicitar Saída</h1>

      <input onChange={(e)=>setMatricula(e.target.value)} />
      <button onClick={solicitar}>Solicitar</button>
    </div>
  );
}

export default SolicitarSaida;