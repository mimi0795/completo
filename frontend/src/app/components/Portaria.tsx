import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Portaria() {

  const [aluno, setAluno] = useState<any>(null);

  useEffect(() => {
    socket.on("novaSolicitacao", (data) => {
      setAluno(data);
    });
  }, []);

  const aprovar = () => {
    socket.emit("confirmarSaida", aluno._id);
    setAluno(null);
  };

  const recusar = () => {
    setAluno(null);
  };

  if (!aluno) return <h2>Aguardando...</h2>;

  return (
    <div>
      <h1>Portaria</h1>

      <p>{aluno.nome}</p>
      <p>{aluno.empresa}</p>

      <button onClick={aprovar}>Aprovar</button>
      <button onClick={recusar}>Recusar</button>
    </div>
  );
}

export default Portaria;