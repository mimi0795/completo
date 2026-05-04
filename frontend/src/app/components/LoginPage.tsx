import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Lock, GraduationCap, Shield } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState<'admin' | 'student' | 'portaria'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (loginType === 'admin') {
      if (email === 'admin@escola.com' && password === 'admin123') {
        navigate('/admin');
      } else {
        setError('Email ou senha inválidos');
      }

    } else if (loginType === 'portaria') {
      if (email === 'porteiro@escola.com' && password === '123') {
        navigate('/portaria');
      } else {
        setError('Acesso da portaria inválido');
      }

    } else {
      if (password) {
        navigate('/entrada', { state: { matricula: password } });
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

          {/* 🔥 BOTÕES (AGORA CORRETO) */}
          <div className="grid grid-cols-3 gap-3 mb-6">

            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 ${
                loginType === 'admin'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-zinc-200 text-zinc-600'
              }`}
            >
              <Shield className="w-5 h-5" />
              Admin
            </button>

            <button
              type="button"
              onClick={() => setLoginType('student')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 ${
                loginType === 'student'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-zinc-200 text-zinc-600'
              }`}
            >
              <User className="w-5 h-5" />
              Aluno
            </button>

            <button
              type="button"
              onClick={() => setLoginType('portaria')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 ${
                loginType === 'portaria'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-zinc-200 text-zinc-600'
              }`}
            >
              <Shield className="w-5 h-5" />
              Portaria
            </button>

          </div>

          <form onSubmit={handleLogin}>

            {/* 🔥 CORREÇÃO AQUI */}
            {(loginType === 'admin' || loginType === 'portaria') ? (
              <>
                <div className="mb-4">
                  <label className="block text-zinc-700 mb-2">Email</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg"
                      placeholder="email@escola.com"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-zinc-700 mb-2">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg"
                      placeholder="••••••"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="mb-6">
                <label className="block text-zinc-700 mb-2">Matrícula</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    placeholder="Digite sua matrícula"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg">
              Entrar
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}