import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { LogOut, User, Mail } from 'lucide-react';
import QRScanner from './QRScanner';

interface Aluno {
  nome: string;
  email: string;
}

export default function StudentDashboard() {
  const navigate = useNavigate();

  const aluno = useMemo<Aluno | null>(() => {
    const raw = localStorage.getItem('aluno');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const hasAuth = Boolean(localStorage.getItem('tokenAluno') && aluno);

  useEffect(() => {
    if (!hasAuth) navigate('/');
  }, [hasAuth, navigate]);

  if (!hasAuth || !aluno) return null;

  const handleLogout = () => {
    localStorage.removeItem('tokenAluno');
    localStorage.removeItem('aluno');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-zinc-900">Area do Aluno</h1>
            <p className="text-zinc-600 mt-1">Bem-vindo, {aluno.nome}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-zinc-200 rounded-lg">
              <h2 className="text-zinc-900 mb-6">Dados da Conta</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-500 text-sm">Nome</p>
                    <p className="text-zinc-900">{aluno.nome}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-500 text-sm">Email</p>
                    <p className="text-zinc-900">{aluno.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <QRScanner onScanSuccess={() => {}} />
          </div>
        </div>
      </main>
    </div>
  );
}
