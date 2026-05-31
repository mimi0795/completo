import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  ArrowLeft,
  LogIn,
  Mail,
  ShieldCheck
} from 'lucide-react';
import {
  QR_SAIDA_TOKEN,
  isQrSaidaTokenValido
} from '../qrAccess';

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
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {

    const params = new URLSearchParams(
      location.search || window.location.search
    );

    const qrToken =
      params.get('qr');

    if (isQrSaidaTokenValido(qrToken)) {
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
      !isQrSaidaTokenValido(acesso.codigo) ||
      expirado
    ) {
      sessionStorage.removeItem(
        'acessoSolicitarSaida'
      );
      navigate('/');
    }

  }, [location.search, navigate]);

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
        'ultimaSolicitacaoSaida',
        JSON.stringify(alunoCompleto)
      );

      const agora = new Date();

      const respostaSolicitacao = await fetch(
        `${API}/confirmacao`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            alunoId: alunoCompleto._id,
            nome: alunoCompleto.nome,
            email: alunoCompleto.email,
            data: agora.toLocaleDateString('pt-BR'),
            hora: agora.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })
          })
        }
      );

      const dadosSolicitacao =
        await respostaSolicitacao.json();

      if (!respostaSolicitacao.ok) {
        setError(
          dadosSolicitacao.msg ||
            'Erro ao enviar solicitacao para a portaria'
        );
        return;
      }

      setEnviado(true);
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
            Digite o email do aluno para enviar a solicitacao ao dispositivo logado na portaria.
          </p>

          {enviado && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              Solicitacao enviada. Aguarde a liberacao no dispositivo da portaria.
            </div>
          )}

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
                  disabled={enviado}
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
              disabled={loading || enviado}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {enviado
                ? 'Solicitacao enviada'
                : loading
                ? 'Buscando...'
                : 'Enviar para portaria'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
