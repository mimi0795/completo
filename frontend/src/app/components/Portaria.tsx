
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Search, User, GraduationCap, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Aluno {
  _id: string;
  nome: string;
  email: string;
  curso: string;
  senha: string;
  createdAt: string;
}

export default function DashboardPorteiro() {
  const API = 'http://localhost:5000';

  const navigate = useNavigate();

  /* =========================================
     ESTADOS
  ========================================= */

  const [alunos, setAlunos] =
    useState<Aluno[]>([]);

  const [busca, setBusca] =
    useState('');

  const [loading, setLoading] =
    useState(true);
  function sair() {

    localStorage.removeItem(
      'tokenPorteiro'
    );

    navigate('/');

  }


  /* =========================================
     URL DO BACKEND
  ========================================= */



  /* =========================================
     PEGAR ALUNOS DO BANCO
  ========================================= */

  useEffect(() => {

    buscarAlunos();

  }, []);

  async function buscarAlunos() {

    try {

      const resposta =
        await fetch(
          `${API}/aluno/lista`
        );

      const dados =
        await resposta.json();

      setAlunos(dados);

    } catch (error) {

      console.log(error);

    }

  }


  /* =========================================
     FILTRO DE PESQUISA
  ========================================= */

  const alunosFiltrados =
    alunos.filter((aluno) => {

      return aluno.nome
        .toLowerCase()
        .includes(
          busca.toLowerCase()
        );

    });

  /* =========================================
     ABRIR PERFIL DO ALUNO
  ========================================= */

  function abrirAluno(id: string) {

    navigate(`/aluno/${id}`);

  }

  return (

    <div className="min-h-screen bg-zinc-100 p-6">

      {/* =====================================
         TOPO
      ===================================== */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold text-zinc-800">

            Dashboard Porteiro

          </h1>
          <button
            onClick={sair}
            className="
    flex items-center gap-2
    bg-red-500
    hover:bg-red-600
    text-white
    px-4 py-2
    rounded-lg
    transition
  "
          >

            <LogOut className="w-5 h-5" />

            Sair

          </button>
          <p className="text-zinc-500">

            Lista de alunos cadastrados

          </p>

        </div>

      </div>

      {/* =====================================
         PESQUISA
      ===================================== */}

      <div className="bg-white p-4 rounded-xl shadow mb-6">

        <div className="relative">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />

          <input
            type="text"
            placeholder="Pesquisar aluno..."
            value={busca}
            onChange={(e) =>
              setBusca(
                e.target.value
              )
            }
            className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none"
          />

        </div>

      </div>

      {/* =====================================
         LOADING
      ===================================== */}

      {loading && (

        <div className="text-center text-zinc-500">



        </div>

      )}

      {/* =====================================
         LISTA DE ALUNOS
      ===================================== */}

      <div className="grid gap-4">

        {alunosFiltrados.map((aluno) => (

          <div
            key={aluno._id}
            onClick={() =>
              abrirAluno(aluno._id)
            }
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer border border-zinc-200"
          >

            {/* NOME */}

            <div className="flex items-center gap-3 mb-4">

              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">

                <User className="text-indigo-600 w-6 h-6" />

              </div>

              <div>

                <h2 className="text-xl font-semibold text-zinc-800">

                  {aluno.nome}

                </h2>

                <p className="text-zinc-500">

                  {aluno.email}

                </p>

              </div>

            </div>

            {/* CURSO */}

            <div className="flex items-center gap-2 text-zinc-700 mb-2">

              <GraduationCap className="w-5 h-5 text-indigo-600" />

              <span>

                Curso:
                {' '}
                {aluno.curso}

              </span>

            </div>

            {/* SENHA */}

            <div className="flex items-center gap-2 text-zinc-700 mb-2">

              <KeyRound className="w-5 h-5 text-indigo-600" />

              <span>

                Senha:
                {' '}
                {aluno.senha}

              </span>

            </div>

            {/* DATA */}

            <div className="text-sm text-zinc-400 mt-3">

              Cadastrado em:
              {' '}

              {new Date(
                aluno.createdAt
              ).toLocaleString('pt-BR')}

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}