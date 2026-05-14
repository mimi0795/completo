import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { LogOut, Search, User, GraduationCap, Mail } from 'lucide-react';

interface Student {
  _id: string;
  nome: string;
  email: string;
}

const API = 'http://localhost:5000';

export default function PorterDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('tokenPorteiro');
    if (!token) {
      navigate('/');
      return;
    }

    const loadStudents = async () => {
      try {
        const response = await fetch(`${API}/aluno/listar`);
        const data = await response.json();
        if (!response.ok) throw new Error(data?.msg || 'Erro ao carregar');
        setStudents(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadStudents();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('tokenPorteiro');
    localStorage.removeItem('porteiro');
    navigate('/');
  };

  const filteredStudents = students.filter((student) =>
    student.nome.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-zinc-900 text-2xl font-bold">Area do Porteiro</h1>
            <p className="text-zinc-600 mt-1">Controle de alunos cadastrados</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white border border-zinc-200 rounded-lg p-5 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input type="text" placeholder="Pesquisar aluno por nome ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
          </div>
        </div>

        <div className="space-y-4">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div key={student._id} className="bg-white border border-zinc-200 rounded-lg p-6 hover:shadow-md transition-all">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3"><User className="w-5 h-5 text-indigo-600 mt-1" /><div><p className="text-sm text-zinc-500">Nome</p><p className="text-zinc-900 font-medium">{student.nome}</p></div></div>
                  <div className="flex items-start gap-3"><Mail className="w-5 h-5 text-indigo-600 mt-1" /><div><p className="text-sm text-zinc-500">Email</p><p className="text-zinc-900 font-medium">{student.email}</p></div></div>
                  <div className="flex items-start gap-3"><GraduationCap className="w-5 h-5 text-indigo-600 mt-1" /><div><p className="text-sm text-zinc-500">Status</p><p className="text-zinc-900 font-medium">Ativo</p></div></div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-zinc-200 rounded-lg p-10 text-center">
              <p className="text-zinc-500">Nenhum aluno encontrado.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
