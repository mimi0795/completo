import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Users, TrendingUp, TrendingDown, CheckCircle, Clock, XCircle, QrCode, LogOut, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface Student {
  id: number;
  nome: string;
  matricula: string;
  email: string;
  curso: string;
  dataInicio: string;
  dataTermino: string;
}

// Dados mock de alunos que usaram QR code
const qrScanData = [
  { id: 1, nome: 'Ana Silva', curso: 'Engenharia de Software', empresa: 'Tech Solutions', data: '13/04/2026', hora: '09:15' },
  { id: 2, nome: 'Carlos Oliveira', curso: 'Administração', empresa: 'Consultoria ABC', data: '13/04/2026', hora: '10:30' },
  { id: 3, nome: 'Marina Santos', curso: 'Design Gráfico', empresa: 'Creative Studio', data: '12/04/2026', hora: '14:20' },
  { id: 4, nome: 'Pedro Costa', curso: 'Ciência da Computação', empresa: 'DataCorp', data: '12/04/2026', hora: '08:45' },
  { id: 5, nome: 'Juliana Ferreira', curso: 'Marketing', empresa: 'Marketing Pro', data: '11/04/2026', hora: '11:00' },
  { id: 6, nome: 'Roberto Lima', curso: 'Engenharia Civil', empresa: 'Construções Ltda', data: '11/04/2026', hora: '13:30' },
  { id: 7, nome: 'Beatriz Alves', curso: 'Psicologia', empresa: 'Clínica Bem Estar', data: '10/04/2026', hora: '15:45' },
  { id: 8, nome: 'Lucas Mendes', curso: 'Direito', empresa: 'Advocacia & Cia', data: '10/04/2026', hora: '09:00' },
];

// Estatísticas de estágio
const stats = {
  concluidos: 124,
  emAndamento: 87,
  semEstagio: 43,
  total: 254
};

const chartData = [
  { name: 'Concluídos', value: stats.concluidos, color: '#22c55e' },
  { name: 'Em Andamento', value: stats.emAndamento, color: '#3b82f6' },
  { name: 'Sem Estágio', value: stats.semEstagio, color: '#ef4444' }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students'>('dashboard');
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      nome: 'Ana Silva',
      matricula: '2024001',
      email: 'ana.silva@email.com',
      curso: 'Engenharia de Software',
      dataInicio: '01/02/2024',
      dataTermino: '31/12/2027',
    },
    {
      id: 2,
      nome: 'Carlos Oliveira',
      matricula: '2024002',
      email: 'carlos.oliveira@email.com',
      curso: 'Administração',
      dataInicio: '01/02/2024',
      dataTermino: '31/12/2027',
    },
  ]);

  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    nome: '',
    matricula: '',
    email: '',
    curso: '',
    dataInicio: '',
    dataTermino: '',
  });

  const handleLogout = () => {
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: students.length + 1,
      ...formData,
    };
    setStudents([...students, newStudent]);
    setFormData({
      nome: '',
      matricula: '',
      email: '',
      curso: '',
      dataInicio: '',
      dataTermino: '',
    });
  };

  const handleDelete = (id: number) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-zinc-900">Dashboard Administrativo</h1>
            <p className="text-zinc-600 mt-1">Gestão de estágios e frequência</p>
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

      {/* Tabs */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'students'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <UserPlus className="w-5 h-5" />
              Cadastro de Alunos
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <>
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 border border-zinc-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-zinc-100 rounded-lg">
                <Users className="w-6 h-6 text-zinc-700" />
              </div>
            </div>
            <div className="text-3xl font-bold text-zinc-900 mb-1">{stats.total}</div>
            <div className="text-zinc-600">Total de Alunos</div>
          </div>

          <div className="bg-white p-6 border border-zinc-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-700" />
              </div>
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {((stats.concluidos / stats.total) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="text-3xl font-bold text-zinc-900 mb-1">{stats.concluidos}</div>
            <div className="text-zinc-600">Estágios Concluídos</div>
          </div>

          <div className="bg-white p-6 border border-zinc-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-700" />
              </div>
              <span className="text-blue-600 flex items-center gap-1">
                {((stats.emAndamento / stats.total) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="text-3xl font-bold text-zinc-900 mb-1">{stats.emAndamento}</div>
            <div className="text-zinc-600">Em Andamento</div>
          </div>

          <div className="bg-white p-6 border border-zinc-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-700" />
              </div>
              <span className="text-red-600 flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                {((stats.semEstagio / stats.total) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="text-3xl font-bold text-zinc-900 mb-1">{stats.semEstagio}</div>
            <div className="text-zinc-600">Sem Estágio</div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 border border-zinc-200">
            <h2 className="text-zinc-900 mb-6">Distribuição de Estágios</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 border border-zinc-200">
            <h2 className="text-zinc-900 mb-6">Comparativo de Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabela de registros QR */}
        <div className="bg-white border border-zinc-200">
          <div className="p-6 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <QrCode className="w-5 h-5 text-zinc-700" />
              <h2 className="text-zinc-900">Registros de Frequência (QR Code)</h2>
            </div>
            <p className="text-zinc-600 mt-1">Últimos acessos registrados</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-3 text-left text-zinc-700">Aluno</th>
                  <th className="px-6 py-3 text-left text-zinc-700">Curso</th>
                  <th className="px-6 py-3 text-left text-zinc-700">Empresa</th>
                  <th className="px-6 py-3 text-left text-zinc-700">Data</th>
                  <th className="px-6 py-3 text-left text-zinc-700">Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {qrScanData.map((registro) => (
                  <tr key={registro.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-900">{registro.nome}</td>
                    <td className="px-6 py-4 text-zinc-600">{registro.curso}</td>
                    <td className="px-6 py-4 text-zinc-600">{registro.empresa}</td>
                    <td className="px-6 py-4 text-zinc-600">{registro.data}</td>
                    <td className="px-6 py-4 text-zinc-600">{registro.hora}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 text-zinc-600">
            Mostrando {qrScanData.length} registros recentes
          </div>
        </div>
        </>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Formulário de cadastro */}
            <div className="bg-white p-6 border border-zinc-200 rounded-lg">
              <div className="flex items-center gap-3 mb-6">
                <UserPlus className="w-6 h-6 text-indigo-600" />
                <h2 className="text-zinc-900">Cadastrar Novo Aluno</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nome" className="block text-zinc-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="Digite o nome completo"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="matricula" className="block text-zinc-700 mb-2">
                      Matrícula (Senha)
                    </label>
                    <input
                      id="matricula"
                      name="matricula"
                      type="text"
                      value={formData.matricula}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="Ex: 2024001"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-zinc-700 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="email@exemplo.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="curso" className="block text-zinc-700 mb-2">
                      Curso
                    </label>
                    <input
                      id="curso"
                      name="curso"
                      type="text"
                      value={formData.curso}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="Ex: Engenharia de Software"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="dataInicio" className="block text-zinc-700 mb-2">
                      Data de Início
                    </label>
                    <input
                      id="dataInicio"
                      name="dataInicio"
                      type="date"
                      value={formData.dataInicio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="dataTermino" className="block text-zinc-700 mb-2">
                      Data de Término
                    </label>
                    <input
                      id="dataTermino"
                      name="dataTermino"
                      type="date"
                      value={formData.dataTermino}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Cadastrar Aluno
                </button>
              </form>
            </div>

            {/* Lista de alunos */}
            <div className="bg-white border border-zinc-200 rounded-lg">
              <div className="p-6 border-b border-zinc-200">
                <h2 className="text-zinc-900">Alunos Cadastrados</h2>
                <p className="text-zinc-600 mt-1">{students.length} alunos no sistema</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-zinc-700">Nome</th>
                      <th className="px-6 py-3 text-left text-zinc-700">Matrícula</th>
                      <th className="px-6 py-3 text-left text-zinc-700">Email</th>
                      <th className="px-6 py-3 text-left text-zinc-700">Curso</th>
                      <th className="px-6 py-3 text-left text-zinc-700">Início</th>
                      <th className="px-6 py-3 text-left text-zinc-700">Término</th>
                      <th className="px-6 py-3 text-left text-zinc-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4 text-zinc-900">{student.nome}</td>
                        <td className="px-6 py-4 text-zinc-600">{student.matricula}</td>
                        <td className="px-6 py-4 text-zinc-600">{student.email}</td>
                        <td className="px-6 py-4 text-zinc-600">{student.curso}</td>
                        <td className="px-6 py-4 text-zinc-600">{student.dataInicio}</td>
                        <td className="px-6 py-4 text-zinc-600">{student.dataTermino}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
