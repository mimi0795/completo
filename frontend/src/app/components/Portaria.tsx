import { useEffect, useState } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  Search,
  User,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router';

interface Frequencia {
  data: string;
  hora: string;
  status: string;
}

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
  frequencia?: Frequencia[];
}

export default function DashboardPorteiro() {
  const API = 'https://completo-vvuw.onrender.com';
  const navigate = useNavigate();

  const [alunos, setAlunos] =
    useState<Aluno[]>([]);

  const [busca, setBusca] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [erroLista, setErroLista] =
    useState('');

  const [alunoSelecionado, setAlunoSelecionado] =
    useState<Aluno | null>(null);

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
      setErroLista('');

      const resposta =
        await fetch(`${API}/aluno/lista`);

      const respostaFinal =
        resposta.status === 404
          ? await fetch(`${API}/aluno/listar`)
          : resposta;

      if (!respostaFinal.ok) {
        throw new Error(
          `Erro ${respostaFinal.status} ao buscar alunos`
        );
      }

      const dados = await respostaFinal.json();

      if (!Array.isArray(dados)) {
        throw new Error(
          'A API nao retornou uma lista de alunos'
        );
      }

      setAlunos(dados);
    } catch (error) {
      console.log(error);
      setAlunos([]);
      setErroLista(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar alunos'
      );
    } finally {
      setLoading(false);
    }
  }

  async function abrirAluno(aluno: Aluno) {
    try {
      const resposta = await fetch(
        `${API}/aluno/${aluno._id}`
      );

      const alunoCompleto =
        resposta.ok
          ? await resposta.json()
          : aluno;

      localStorage.setItem(
        'alunoSelecionado',
        JSON.stringify(alunoCompleto)
      );

      setAlunoSelecionado(alunoCompleto);
    } catch (error) {
      console.log(error);

      localStorage.setItem(
        'alunoSelecionado',
        JSON.stringify(aluno)
      );

      setAlunoSelecionado(aluno);
    }
  }

  function fecharPerfil() {
    localStorage.removeItem(
      'alunoSelecionado'
    );

    setAlunoSelecionado(null);
  }

  function sair() {
    localStorage.removeItem(
      'tokenPorteiro'
    );

    localStorage.removeItem(
      'alunoSelecionado'
    );

    navigate('/');
  }

  function liberarAluno() {
    if (!alunoSelecionado) return;

    alert(
      `Saida liberada para ${alunoSelecionado.nome}`
    );

    setAlunoSelecionado(null);
    localStorage.removeItem(
      'alunoSelecionado'
    );
  }

  function texto(valor?: string) {
    return valor && valor.trim()
      ? valor
      : 'Nao informado';
  }

  function formatarData(data?: string) {
    if (!data) return 'Nao informado';

    const dataFormatada = new Date(data);

    if (
      Number.isNaN(dataFormatada.getTime())
    ) {
      return data;
    }

    return dataFormatada.toLocaleString(
      'pt-BR'
    );
  }

  function calculateDaysRemaining(
    endDate?: string
  ) {
    if (!endDate) return 0;

    let end: Date;

    if (endDate.includes('/')) {
      const [day, month, year] =
        endDate.split('/').map(Number);

      end = new Date(year, month - 1, day);
    } else {
      end = new Date(endDate);
    }

    if (Number.isNaN(end.getTime())) {
      return 0;
    }

    const today = new Date();
    const diffTime =
      end.getTime() - today.getTime();
    const diffDays =
      Math.ceil(
        diffTime /
          (1000 * 60 * 60 * 24)
      );

    return diffDays > 0
      ? diffDays
      : 0;
  }

  const alunosFiltrados =
    alunos.filter((aluno) =>
      aluno.nome
        .toLowerCase()
        .includes(busca.toLowerCase())
    );

  const diasRestantes =
    calculateDaysRemaining(
      alunoSelecionado?.estagio?.dataFim
    );

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-800">
            Dashboard Porteiro
          </h1>

          <p className="text-zinc-500">
            Lista de alunos cadastrados
          </p>
        </div>

        <button
          onClick={sair}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />

          <input
            type="text"
            placeholder="Pesquisar aluno..."
            value={busca}
            onChange={(e) =>
              setBusca(e.target.value)
            }
            className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none"
          />
        </div>
      </div>

      {alunoSelecionado && (
        <div className="bg-white rounded-xl shadow mb-6 border border-indigo-200 overflow-hidden">
          <div className="p-6 border-b border-zinc-200 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="text-indigo-600 w-7 h-7" />
              </div>

              <div>
                <p className="text-sm text-indigo-600 font-medium">
                  Perfil do aluno
                </p>

                <h2 className="text-2xl font-bold text-zinc-900">
                  {texto(alunoSelecionado.nome)}
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

          <div className="p-6 space-y-6">
            <section>
              <h3 className="text-zinc-900 mb-4 text-xl font-semibold">
                Informacoes Pessoais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-500 text-sm">
                      Nome Completo
                    </p>
                    <p className="text-zinc-900">
                      {texto(alunoSelecionado.nome)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-500 text-sm">
                      Matricula
                    </p>
                    <p className="text-zinc-900">
                      {texto(alunoSelecionado.matricula)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-500 text-sm">
                      Email
                    </p>
                    <p className="text-zinc-900">
                      {texto(alunoSelecionado.email)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-500 text-sm">
                      Curso
                    </p>
                    <p className="text-zinc-900">
                      {texto(alunoSelecionado.curso)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <KeyRound className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-500 text-sm">
                      Senha
                    </p>
                    <p className="text-zinc-900">
                      {texto(alunoSelecionado.senha)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-500 text-sm">
                      Cadastro
                    </p>
                    <p className="text-zinc-900">
                      {formatarData(
                        alunoSelecionado.createdAt ||
                          alunoSelecionado.criadoEm
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-indigo-600" />
                <h3 className="text-zinc-900 text-xl font-semibold">
                  Estagio Atual
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-zinc-500 text-sm mb-1">
                    Empresa
                  </p>
                  <p className="text-zinc-900 font-medium text-lg">
                    {texto(alunoSelecionado.estagio?.empresa)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-zinc-500 text-sm mb-1">
                      Cargo
                    </p>
                    <p className="text-zinc-900">
                      {texto(alunoSelecionado.estagio?.cargo)}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm mb-1">
                      Supervisor
                    </p>
                    <p className="text-zinc-900">
                      {texto(alunoSelecionado.estagio?.supervisor)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-500 text-sm mb-1">
                      Endereco
                    </p>
                    <p className="text-zinc-900">
                      {texto(alunoSelecionado.estagio?.endereco)}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-indigo-600" />
                      <span className="text-zinc-900 font-medium">
                        Tempo Restante
                      </span>
                    </div>

                    <span className="text-2xl font-bold text-indigo-600">
                      {diasRestantes} dias
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-zinc-900 mb-4 text-xl font-semibold">
                Historico de Frequencia
              </h3>

              <div className="space-y-2">
                {alunoSelecionado.frequencia?.length ? (
                  alunoSelecionado.frequencia.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-200"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-zinc-400" />

                          <div>
                            <p className="text-zinc-900">
                              {item.data}
                            </p>
                            <p className="text-zinc-500 text-sm">
                              {item.hora}
                            </p>
                          </div>
                        </div>

                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {item.status}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-zinc-500">
                    Nenhuma frequencia registrada
                  </div>
                )}
              </div>
            </section>

            <button
              type="button"
              onClick={liberarAluno}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition flex items-center justify-center gap-2 font-medium"
            >
              <CheckCircle className="w-5 h-5" />
              Liberar
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center text-zinc-500">
          Carregando alunos...
        </div>
      )}

      {erroLista && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4">
          {erroLista}. Verifique se o backend do Render foi atualizado e se a URL da API esta correta.
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow mb-4 border border-zinc-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Alunos cadastrados
            </h2>

            <p className="text-zinc-500">
              {alunosFiltrados.length} de {alunos.length} alunos na lista
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {alunosFiltrados.map((aluno) => (
          <button
            type="button"
            key={aluno._id}
            onClick={() => abrirAluno(aluno)}
            className={`bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer border text-left ${
              alunoSelecionado?._id === aluno._id
                ? 'border-indigo-500 ring-2 ring-indigo-100'
                : 'border-zinc-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="text-indigo-600 w-6 h-6" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-800">
                  {texto(aluno.nome)}
                </h2>

                <p className="text-zinc-500">
                  {texto(aluno.email)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-700 mb-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>
                Curso: {texto(aluno.curso)}
              </span>
            </div>

            <div className="text-sm text-zinc-400 mt-3">
              Cadastrado em:{' '}
              {formatarData(
                aluno.createdAt ||
                  aluno.criadoEm
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
