
import { useEffect, useState } from 'react';
import {
  Building2,
  Calendar,
  GraduationCap,
  KeyRound,
  LogOut,
  Mail,
  Search,
  User,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router';

interface Aluno {
  _id: string;
  nome: string;
  email: string;
  curso?: string;
  matricula?: string;
  periodo?: string;
  senha: string;
  criadoEm?: string;
  createdAt?: string;
  estagio?: {
    empresa?: string;
    cargo?: string;
    supervisor?: string;
    dataInicio?: string;
    dataFim?: string;
    endereco?: string;
  };
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

  const [alunoSelecionado, setAlunoSelecionado] =
    useState<Aluno | null>(null);
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

    const alunoSalvo =
      localStorage.getItem(
        'alunoSelecionado'
      );

    if (alunoSalvo) {
      setAlunoSelecionado(
        JSON.parse(alunoSalvo)
      );
    }

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

    } finally {

      setLoading(false);

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

  function abrirAluno(aluno: Aluno) {

  // salva o aluno clicado
  localStorage.setItem(
    'alunoSelecionado',
    JSON.stringify(aluno)
  );

  // abre página do perfil
  setAlunoSelecionado(aluno);

}

  function fecharPerfil() {

    localStorage.removeItem(
      'alunoSelecionado'
    );

    setAlunoSelecionado(null);

  }

  function formatarData(data?: string) {

    if (!data) return 'Não informado';

    return new Date(data).toLocaleString(
      'pt-BR'
    );

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

      {alunoSelecionado && (

        <div className="bg-white p-6 rounded-xl shadow mb-6 border border-indigo-200">

          <div className="flex items-start justify-between gap-4 mb-6">

            <div className="flex items-center gap-3">

              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">

                <User className="text-indigo-600 w-7 h-7" />

              </div>

              <div>

                <p className="text-sm text-indigo-600 font-medium">

                  Perfil selecionado

                </p>

                <h2 className="text-2xl font-bold text-zinc-900">

                  {alunoSelecionado.nome}

                </h2>

              </div>

            </div>

            <button
              type="button"
              onClick={fecharPerfil}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            >

              <X className="w-5 h-5" />

            </button>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="flex items-center gap-3 text-zinc-700">

              <Mail className="w-5 h-5 text-indigo-600" />

              <span>{alunoSelecionado.email}</span>

            </div>

            <div className="flex items-center gap-3 text-zinc-700">

              <GraduationCap className="w-5 h-5 text-indigo-600" />

              <span>
                Curso: {alunoSelecionado.curso || 'Não informado'}
              </span>

            </div>

            <div className="flex items-center gap-3 text-zinc-700">

              <KeyRound className="w-5 h-5 text-indigo-600" />

              <span>Senha: {alunoSelecionado.senha}</span>

            </div>

            <div className="flex items-center gap-3 text-zinc-700">

              <Calendar className="w-5 h-5 text-indigo-600" />

              <span>
                Cadastro: {formatarData(
                  alunoSelecionado.createdAt ||
                  alunoSelecionado.criadoEm
                )}
              </span>

            </div>

            <div className="flex items-center gap-3 text-zinc-700">

              <User className="w-5 h-5 text-indigo-600" />

              <span>
                Matrícula: {alunoSelecionado.matricula || 'Não informado'}
              </span>

            </div>

            <div className="flex items-center gap-3 text-zinc-700">

              <Building2 className="w-5 h-5 text-indigo-600" />

              <span>
                Empresa: {alunoSelecionado.estagio?.empresa || 'Não informado'}
              </span>

            </div>

          </div>

        </div>

      )}

      {/* =====================================
         LOADING
      ===================================== */}

      {loading && (

        <div className="text-center text-zinc-500">

          Carregando alunos...

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
            abrirAluno(aluno)
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
                {aluno.curso || 'Não informado'}

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

              {formatarData(
                aluno.createdAt ||
                aluno.criadoEm
              )}

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}
