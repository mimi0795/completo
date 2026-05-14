import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Users, TrendingUp, TrendingDown, CheckCircle, Clock, XCircle, QrCode, LogOut, UserPlus, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface Student {
  _id: string;
  nome: string;
  email: string;
  criadoEm: string;
}

const API = 'http://localhost:5000';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students'>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  });
  const [error, setError] = useState('');

  const loadStudents = async () => {
    try {
      const response = await fetch(`${API}/aluno/listar`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.msg || 'Erro ao carregar alunos');
      }
      setStudents(data);
    } catch (err) {
      console.error(err);
      setError('Nao foi possivel carregar os alunos.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    if (!token) {
      navigate('/');
      return;
    }
    loadStudents();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('tokenAdmin');
    localStorage.removeItem('admin');
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API}/aluno/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.msg || 'Erro ao cadastrar aluno');
        return;
      }

      setStudents((prev) => [data, ...prev]);
      setFormData({ nome: '', email: '', senha: '' });
    } catch (err) {
      console.error(err);
      setError('Erro ao conectar com servidor.');
    }
  };

  const handleDelete = (id: string) => {
    setStudents(students.filter((student) => student._id !== id));
  };

  const stats = {
    concluidos: 0,
    emAndamento: students.length,
    semEstagio: 0,
    total: students.length,
  };

  const chartData = [
    { name: 'Concluidos', value: stats.concluidos, color: '#22c55e' },
    { name: 'Ativos', value: stats.emAndamento, color: '#3b82f6' },
    { name: 'Sem Estagio', value: stats.semEstagio, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-zinc-900">Dashboard Administrativo</h1>
            <p className="text-zinc-600 mt-1">Gestao de alunos conectada ao backend</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button onClick={() => setActiveTab('dashboard')} className={`py-4 border-b-2 transition-colors ${activeTab === 'dashboard' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-600 hover:text-zinc-900'}`}>
              Dashboard
            </button>
            <button onClick={() => setActiveTab('students')} className={`py-4 border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'students' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-600 hover:text-zinc-900'}`}>
              <UserPlus className="w-5 h-5" />
              Cadastro de Alunos
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 border border-zinc-200"><div className="text-3xl font-bold text-zinc-900 mb-1">{stats.total}</div><div className="text-zinc-600">Total de Alunos</div></div>
              <div className="bg-white p-6 border border-zinc-200"><div className="text-3xl font-bold text-zinc-900 mb-1">{stats.concluidos}</div><div className="text-zinc-600">Estagios Concluidos</div></div>
              <div className="bg-white p-6 border border-zinc-200"><div className="text-3xl font-bold text-zinc-900 mb-1">{stats.emAndamento}</div><div className="text-zinc-600">Ativos no Sistema</div></div>
              <div className="bg-white p-6 border border-zinc-200"><div className="text-3xl font-bold text-zinc-900 mb-1">{stats.semEstagio}</div><div className="text-zinc-600">Sem Estagio</div></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 border border-zinc-200">
                <h2 className="text-zinc-900 mb-6">Distribuicao</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value">
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 border border-zinc-200">
                <h2 className="text-zinc-900 mb-6">Comparativo</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-zinc-200">
              <div className="p-6 border-b border-zinc-200">
                <div className="flex items-center gap-3"><QrCode className="w-5 h-5 text-zinc-700" /><h2 className="text-zinc-900">Alunos cadastrados</h2></div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr><th className="px-6 py-3 text-left text-zinc-700">Nome</th><th className="px-6 py-3 text-left text-zinc-700">Email</th><th className="px-6 py-3 text-left text-zinc-700">Cadastro</th></tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {students.map((registro) => (
                      <tr key={registro._id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4 text-zinc-900">{registro.nome}</td>
                        <td className="px-6 py-4 text-zinc-600">{registro.email}</td>
                        <td className="px-6 py-4 text-zinc-600">{new Date(registro.criadoEm).toLocaleDateString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="bg-white p-6 border border-zinc-200 rounded-lg">
              <div className="flex items-center gap-3 mb-6"><UserPlus className="w-6 h-6 text-indigo-600" /><h2 className="text-zinc-900">Cadastrar Novo Aluno</h2></div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input name="nome" type="text" value={formData.nome} onChange={handleInputChange} className="w-full px-4 py-3 border border-zinc-300 rounded-lg" placeholder="Nome" required />
                  <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-zinc-300 rounded-lg" placeholder="email@exemplo.com" required />
                  <input name="senha" type="text" value={formData.senha} onChange={handleInputChange} className="w-full px-4 py-3 border border-zinc-300 rounded-lg" placeholder="Senha" required />
                </div>
                <button type="submit" className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Cadastrar Aluno
                </button>
              </form>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg">
              <div className="p-6 border-b border-zinc-200"><h2 className="text-zinc-900">Alunos Cadastrados</h2><p className="text-zinc-600 mt-1">{students.length} alunos no sistema</p></div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 border-b border-zinc-200"><tr><th className="px-6 py-3 text-left text-zinc-700">Nome</th><th className="px-6 py-3 text-left text-zinc-700">Email</th><th className="px-6 py-3 text-left text-zinc-700">Acoes</th></tr></thead>
                  <tbody className="divide-y divide-zinc-200">
                    {students.map((student) => (
                      <tr key={student._id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4 text-zinc-900">{student.nome}</td>
                        <td className="px-6 py-4 text-zinc-600">{student.email}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleDelete(student._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
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
