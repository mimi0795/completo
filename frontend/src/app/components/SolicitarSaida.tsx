import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  LogIn,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { QR_SAIDA_TOKEN } from '../qrAccess';

interface Aluno {
  _id: string;
  nome: string;
  email: string;
  senha: string;
  curso?: string;
  matricula?: string;
  periodo?: string;
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
  frequencia?: {
    data: string;
    hora: string;
    status: string;
  }[];
}

export default function SolicitarSaida() {
const API = "https://completo-a3yj.onrender.com";
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const qrToken =
      params.get('qr');

    if (qrToken === QR_SAIDA_TOKEN) {
      sessionStorage.setItem(
        'acessoSolicitarSaida',
        JSON.stringify({
          origem: 'qr-code',
          codigo: QR_SAIDA_TOKEN,
          criadoEm: Date.now()
        })
      );
    }

    const acessoSalvo =
      sessionStorage.getItem(
        'acessoSolicitarSaida'
      );

    if (!acessoSalvo) {
      navigate('/');
      return;
    }

    const acesso = JSON.parse(acessoSalvo);
    const expirado =
      Date.now() - acesso.criadoEm >
      2 * 60 * 1000;

    if (
      acesso.origem !== 'qr-code' ||
      acesso.codigo !== QR_SAIDA_TOKEN ||
      expirado
    ) {
      sessionStorage.removeItem(
        'acessoSolicitarSaida'
      );
      navigate('/');
    }

  }, [navigate]);

  async function buscarPerfilPorEmail(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError('');

    if (!email.trim()) {
      setError('Digite o email do aluno');
      return;
    }

    try {
      setLoading(true);

      const resposta = await fetch(
        `${API}/aluno/lista`
      );

      const alunos: Aluno[] =
        await resposta.json();

      if (!resposta.ok) {
        setError('Erro ao buscar alunos');
        return;
      }

      const alunoEncontrado =
        alunos.find(
          (aluno) =>
            aluno.email.toLowerCase() ===
            email.trim().toLowerCase()
        );

      if (!alunoEncontrado) {
        setError('Email não encontrado');
        return;
      }

      const respostaPerfil = await fetch(
        `${API}/aluno/${alunoEncontrado._id}`
      );

      const alunoCompleto =
        respostaPerfil.ok
          ? await respostaPerfil.json()
          : alunoEncontrado;

      localStorage.setItem(
        'alunoSelecionado',
        JSON.stringify(alunoCompleto)
      );

      navigate('/portaria');
    } catch (error) {
      console.log(error);
      setError('Erro ao conectar com servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="bg-white border border-zinc-200 rounded-xl shadow p-8">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-5">
            <ShieldCheck className="w-7 h-7 text-indigo-600" />
          </div>

          <h1 className="text-2xl font-bold text-zinc-900 mb-2">
            Solicitar saída
          </h1>

          <p className="text-zinc-600 mb-6">
            Digite o email do aluno para abrir o perfil correspondente na portaria.
          </p>

          <form
            onSubmit={buscarPerfilPorEmail}
            className="space-y-4"
          >
            <div>
              <label className="block text-zinc-700 mb-2">
                Email do aluno
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg outline-none focus:border-indigo-600"
                  placeholder="email@escola.com"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {loading
                ? 'Buscando...'
                : 'Abrir na portaria'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
