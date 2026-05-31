import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  XCircle,
  QrCode,
  LogOut,
  UserPlus,
  Edit2,
  Trash2
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

interface Student {
  _id?: string;

  nome: string;
  email: string;
  senha: string;
  matricula: string;
  curso: string;
  periodo: string;

  estagio: {
    empresa: string;
    cargo: string;
    supervisor: string;
    dataInicio: string;
    dataFim: string;
    endereco: string;
  };

  frequencia?: Frequencia[];
}

interface Frequencia {
  data: string;
  hora: string;
  status: string;
}

const stats = {
  concluidos: 124,
  emAndamento: 87,
  semEstagio: 43,
  total: 254
};

const chartData = [
  {
    name: 'Concluídos',
    value: stats.concluidos,
    color: '#22c55e'
  },

  {
    name: 'Em Andamento',
    value: stats.emAndamento,
    color: '#3b82f6'
  },

  {
    name: 'Sem Estágio',
    value: stats.semEstagio,
    color: '#ef4444'
  }
];

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState<'dashboard' | 'students'>('dashboard');

  const [students, setStudents] =
    useState<Student[]>([]);

  const [formData, setFormData] = useState<Student>({
    nome: '',
    email: '',
    senha: '',
    matricula: '',
    curso: '',
    periodo: '',

    estagio: {
      empresa: '',
      cargo: '',
      supervisor: '',
      dataInicio: '',
      dataFim: '',
      endereco: ''
    }
  });

  const handleLogout = () => {
    navigate('/');
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  const handleEstagioChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,

      estagio: {
        ...formData.estagio,
        [name]: value
      }
    });

  };

  const carregarAlunos = async () => {

    try {

      const resposta = await fetch(
        'https://completo-a3yj.onrender.com/aluno/listar'
      );

      const dados = await resposta.json();

      if (Array.isArray(dados)) {
        setStudents(dados);
      }

    } catch (error) {

      console.log(error);

    }

  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const resposta = await fetch(
        'https://completo-a3yj.onrender.com/aluno/cadastro',
        {

          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(formData)

        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {

        alert(dados.msg);

        return;

      }

      alert('Aluno cadastrado com sucesso');

      carregarAlunos();

      setFormData({

        nome: '',
        email: '',
        senha: '',
        matricula: '',
        curso: '',
        periodo: '',

        estagio: {
          empresa: '',
          cargo: '',
          supervisor: '',
          dataInicio: '',
          dataFim: '',
          endereco: ''
        }

      });

    } catch (error) {

      alert('Erro ao cadastrar aluno');

    }

  };

  const handleDelete = async (id: string) => {

    try {

      await fetch(
        `https://completo-a3yj.onrender.com/aluno/deletar/${id}`,
        
        {
          method: 'DELETE'
        }
      );

      carregarAlunos();

    } catch (error) {

      console.log(error);

    }

  };

  const hoje = new Date().toLocaleDateString(
    'pt-BR'
  );

  const totalAlunos = students.length;

  const alunosComEstagio = students.filter(
    (student) =>
      student.estagio?.empresa?.trim() ||
      student.estagio?.cargo?.trim()
  ).length;

  const frequenciasHoje = students.flatMap(
    (student) =>
      (student.frequencia || [])
        .filter((item) => item.data === hoje)
        .map((item) => ({
          aluno: student.nome,
          email: student.email,
          curso: student.curso,
          ...item
        }))
  );

  const entradasHoje = frequenciasHoje.filter(
    (item) =>
      item.status.toLowerCase().includes('entrada')
  ).length;

  const saidasHoje = frequenciasHoje.filter(
    (item) =>
      item.status.toLowerCase().includes('saida') ||
      item.status.toLowerCase().includes('saída')
  ).length;

  return (

    <div className="min-h-screen bg-zinc-50">

      {/* HEADER */}

      <header className="bg-white border-b border-zinc-200">

        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

          <div>

            <h1 className="text-zinc-900 text-2xl font-bold">
              Dashboard Administrativo
            </h1>

            <p className="text-zinc-600 mt-1">
              Gestão de estágios e frequência
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          >

            <LogOut className="w-5 h-5" />
            Sair

          </button>

        </div>

      </header>

      {/* TABS */}

      <div className="bg-white border-b border-zinc-200">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex gap-8">

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-zinc-600'
              }`}
            >

              Dashboard

            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'students'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-zinc-600'
              }`}
            >

              <UserPlus className="w-5 h-5" />
              Cadastro de Alunos

            </button>

          </div>

        </div>

      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* DASHBOARD */}

        {activeTab === 'dashboard' && (

          <>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

              <div className="bg-white p-6 border border-zinc-200 rounded-lg">

                <div className="flex items-center justify-between mb-4">

                  <div className="p-3 bg-indigo-50 rounded-lg">

                    <Users className="w-6 h-6 text-indigo-600" />

                  </div>

                </div>

                <div className="text-3xl font-bold text-zinc-900 mb-1">
                  {totalAlunos}
                </div>

                <div className="text-zinc-600">
                  Alunos cadastrados
                </div>

              </div>

              <div className="bg-white p-6 border border-zinc-200 rounded-lg">

                <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>

                <div className="text-3xl font-bold text-zinc-900 mb-1">
                  {alunosComEstagio}
                </div>

                <div className="text-zinc-600">
                  Com estagio
                </div>

              </div>

              <div className="bg-white p-6 border border-zinc-200 rounded-lg">

                <div className="p-3 bg-green-50 rounded-lg w-fit mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>

                <div className="text-3xl font-bold text-zinc-900 mb-1">
                  {entradasHoje}
                </div>

                <div className="text-zinc-600">
                  Entradas hoje
                </div>

              </div>

              <div className="bg-white p-6 border border-zinc-200 rounded-lg">

                <div className="p-3 bg-amber-50 rounded-lg w-fit mb-4">
                  <TrendingDown className="w-6 h-6 text-amber-600" />
                </div>

                <div className="text-3xl font-bold text-zinc-900 mb-1">
                  {saidasHoje}
                </div>

                <div className="text-zinc-600">
                  Saidas hoje
                </div>

              </div>

            </div>

            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">

              <div className="p-6 border-b border-zinc-200 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-zinc-900 font-semibold text-xl">
                    Frequencia diaria
                  </h2>

                  <p className="text-zinc-500 mt-1">
                    Entradas e saidas registradas em {hoje}
                  </p>
                </div>

                <div className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm">
                  {frequenciasHoje.length} registros
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        Aluno
                      </th>
                      <th className="px-6 py-3 text-left">
                        Curso
                      </th>
                      <th className="px-6 py-3 text-left">
                        Hora
                      </th>
                      <th className="px-6 py-3 text-left">
                        Tipo
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {frequenciasHoje.length ? (
                      frequenciasHoje.map((item, index) => (
                        <tr
                          key={`${item.email}-${item.hora}-${index}`}
                          className="border-b border-zinc-100"
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium text-zinc-900">
                              {item.aluno}
                            </div>
                            <div className="text-sm text-zinc-500">
                              {item.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-zinc-700">
                            {item.curso || 'Nao informado'}
                          </td>
                          <td className="px-6 py-4 text-zinc-700">
                            {item.hora}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.status.toLowerCase().includes('entrada')
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-10 text-center text-zinc-500"
                        >
                          Nenhuma frequencia registrada hoje
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

          </>

        )}

        {/* CADASTRO */}

        {activeTab === 'students' && (

          <div className="space-y-6">

            {/* FORMULÁRIO */}

            <div className="bg-white p-6 border border-zinc-200 rounded-lg">

              <div className="flex items-center gap-3 mb-6">

                <UserPlus className="w-6 h-6 text-indigo-600" />

                <h2 className="text-zinc-900 text-xl font-semibold">
                  Cadastrar Novo Aluno
                </h2>

              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Nome"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg"
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg"
                    required
                  />

                  <input
                    type="text"
                    name="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    placeholder="Senha"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg"
                    required
                  />

                  <input
                    type="text"
                    name="matricula"
                    value={formData.matricula}
                    onChange={handleInputChange}
                    placeholder="Matrícula"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg"
                    required
                  />

                  <input
                    type="text"
                    name="curso"
                    value={formData.curso}
                    onChange={handleInputChange}
                    placeholder="Curso"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg"
                    required
                  />

                  <input
                    type="text"
                    name="periodo"
                    value={formData.periodo}
                    onChange={handleInputChange}
                    placeholder="Período"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg"
                    required
                  />

                </div>

                {/* ESTÁGIO */}

                <h2 className="text-lg font-semibold mt-8">
                  Dados do Estágio
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <input
                    type="text"
                    name="empresa"
                    value={formData.estagio.empresa}
                    onChange={handleEstagioChange}
                    placeholder="Empresa"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg"
                  />

                  <input
                    type="text"
                    name="cargo"
                    value={formData.estagio.cargo}
                    onChange={handleEstagioChange}
                    placeholder="Cargo"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg"
                  />

                  <input
                    type="text"
                    name="supervisor"
                    value={formData.estagio.supervisor}
                    onChange={handleEstagioChange}
                    placeholder="Supervisor"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg"
                  />

                  <input
                    type="date"
                    name="dataInicio"
                    value={formData.estagio.dataInicio}
                    onChange={handleEstagioChange}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg"
                  />

                  <input
                    type="date"
                    name="dataFim"
                    value={formData.estagio.dataFim}
                    onChange={handleEstagioChange}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg"
                  />

                  <input
                    type="text"
                    name="endereco"
                    value={formData.estagio.endereco}
                    onChange={handleEstagioChange}
                    placeholder="Endereço"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg"
                  />

                </div>

                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition-colors font-medium flex items-center gap-2"
                >

                  <UserPlus className="w-5 h-5" />
                  Cadastrar Aluno

                </button>

              </form>

            </div>

            {/* LISTA */}

            <div className="bg-white border border-zinc-200 rounded-lg">

              <div className="p-6 border-b border-zinc-200">

                <h2 className="text-zinc-900 font-semibold text-xl">
                  Alunos Cadastrados
                </h2>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-zinc-50 border-b border-zinc-200">

                    <tr>

                      <th className="px-6 py-3 text-left">
                        Nome
                      </th>

                      <th className="px-6 py-3 text-left">
                        Email
                      </th>

                      <th className="px-6 py-3 text-left">
                        Curso
                      </th>

                      <th className="px-6 py-3 text-left">
                        Ações
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {students.map((student) => (

                      <tr
                        key={student._id}
                        className="border-b"
                      >

                        <td className="px-6 py-4">
                          {student.nome}
                        </td>

                        <td className="px-6 py-4">
                          {student.email}
                        </td>

                        <td className="px-6 py-4">
                          {student.curso}
                        </td>

                        <td className="px-6 py-4">

                          <div className="flex gap-2">

                            <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">

                              <Edit2 className="w-4 h-4" />

                            </button>

                            <button
                              onClick={() =>
                                handleDelete(student._id!)
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >

                              <Trash2 className="w-4 h-4" />

                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>

  );

}
