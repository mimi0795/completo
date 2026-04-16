import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Lock, GraduationCap, Shield } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'admin' | 'student'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (loginType === 'admin') {
      // Validação simples de admin
      if (email === 'admin@escola.com' && password === 'admin123') {
        navigate('/admin');
      } else {
        setError('Email ou senha inválidos');
      }
    } else {
      // Para aluno, apenas senha (matrícula)
      if (password) {
        navigate('/student', { state: { matricula: password } });
      } else {
        setError('Digite sua matrícula');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-zinc-900 mb-2">Sistema de Estágios</h1>
          <p className="text-zinc-600">Gestão e acompanhamento de estágios</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Seletor de tipo de login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                loginType === 'admin'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Admin</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginType('student')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                loginType === 'student'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Aluno</span>
            </button>
          </div>

          <form onSubmit={handleLogin}>
            {loginType === 'admin' ? (
              <>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-zinc-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="admin@escola.com"
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-zinc-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="mb-6">
                <label htmlFor="matricula" className="block text-zinc-700 mb-2">
                  Matrícula
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    id="matricula"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Digite sua matrícula"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Entrar
            </button>
          </form>

          {loginType === 'admin' && (
            <div className="mt-4 p-3 bg-zinc-50 rounded-lg text-zinc-600 text-sm">
              <p className="font-medium mb-1">Acesso de demonstração:</p>
              <p>Email: admin@escola.com</p>
              <p>Senha: admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
