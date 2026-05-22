import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  LogOut,
  Building2,
  Calendar,
  Clock,
  User,
  Mail,
  MapPin
} from 'lucide-react';

import QRScanner from './QRScanner';
import {
  QR_SAIDA_TOKEN,
  isQrSaidaValido
} from '../qrAccess';

interface Aluno {

  _id: string;

  nome: string;

  matricula?: string;

  email: string;

  curso?: string;

  periodo?: string;

  estagio?: {

    empresa: string;

    cargo: string;

    supervisor: string;

    dataInicio: string;

    dataFim: string;

    endereco: string;

  };

  frequencia?: [

    {

      data: string;

      hora: string;

      status: string;

    }

  ];

}

export default function StudentDashboard() {

  const navigate = useNavigate();

  const API = "http://localhost:5000";

  /* =========================================
     ESTADOS
  ========================================= */

  const [aluno, setAluno] =
    useState<Aluno | null>(null);

  const [loading, setLoading] =
    useState(true);

  /* =========================================
     PEGAR ALUNO LOGADO
  ========================================= */

  useEffect(() => {
    pegarAluno();
  }, [navigate]);

  async function pegarAluno() {

    try {

      const alunoSalvo =
        localStorage.getItem('aluno');

      if (!alunoSalvo) {

        navigate('/');

        return;

      }

      const alunoLocal =
        JSON.parse(alunoSalvo);

      setAluno(alunoLocal);

      const resposta =
        await fetch(
          `${API}/aluno/${alunoLocal._id}`
        );

      if (!resposta.ok) {
        setLoading(false);
        return;
      }

      const dados =
        await resposta.json();

      setAluno(dados);

      localStorage.setItem(
        'aluno',
        JSON.stringify(dados)
      );

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);

    }

  }

  /* =========================================
     LOGOUT
  ========================================= */

  function sair() {

    localStorage.removeItem(
      'tokenAluno'
    );

    localStorage.removeItem(
      'aluno'
    );

    navigate('/');

  }

  function abrirSolicitacaoPorQr(
    decodedText: string
  ) {

    if (!isQrSaidaValido(decodedText)) {
      alert('QR Code inválido para solicitar saída');
      return;
    }

    sessionStorage.setItem(
      'acessoSolicitarSaida',
      JSON.stringify({
        origem: 'qr-code',
        codigo: QR_SAIDA_TOKEN,
        criadoEm: Date.now()
      })
    );

    navigate('/solicitar-saida');

  }

  /* =========================================
     CALCULAR DIAS
  ========================================= */

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

  function texto(valor?: string) {

    return valor && valor.trim()
      ? valor
      : 'Nao informado';

  }

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Carregando...

      </div>

    );

  }

  /* =========================================
     SEM ALUNO
  ========================================= */

  if (!aluno) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Aluno não encontrado

      </div>

    );

  }

  const daysRemaining =
    calculateDaysRemaining(
      aluno.estagio?.dataFim
    );

  return (

    <div className="min-h-screen bg-zinc-50">

      {/* HEADER */}

      <header className="bg-white border-b border-zinc-200">

        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

          <div>

            <h1 className="text-zinc-900 text-2xl font-bold">

              Área do Aluno

            </h1>

            <p className="text-zinc-600 mt-1">

              Bem-vindo,
              {' '}
              {texto(aluno.nome)}

            </p>

          </div>

          <button
            onClick={sair}
            className="flex items-center gap-2 px-4 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          >

            <LogOut className="w-5 h-5" />

            Sair

          </button>

        </div>

      </header>

      {/* MAIN */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ESQUERDA */}

          <div className="lg:col-span-2 space-y-6">

            {/* DADOS */}

            <div className="bg-white p-6 border border-zinc-200 rounded-lg">

              <h2 className="text-zinc-900 mb-6 text-xl font-semibold">

                Informações Pessoais

              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* NOME */}

                <div className="flex items-start gap-3">

                  <User className="w-5 h-5 text-zinc-400 mt-0.5" />

                  <div>

                    <p className="text-zinc-500 text-sm">

                      Nome Completo

                    </p>

                    <p className="text-zinc-900">

                      {texto(aluno.nome)}

                    </p>

                  </div>

                </div>

                {/* MATRÍCULA */}

                <div className="flex items-start gap-3">

                  <User className="w-5 h-5 text-zinc-400 mt-0.5" />

                  <div>

                    <p className="text-zinc-500 text-sm">

                      Matrícula

                    </p>

                    <p className="text-zinc-900">

                      {texto(aluno.matricula)}

                    </p>

                  </div>

                </div>

                {/* EMAIL */}

                <div className="flex items-start gap-3">

                  <Mail className="w-5 h-5 text-zinc-400 mt-0.5" />

                  <div>

                    <p className="text-zinc-500 text-sm">

                      Email

                    </p>

                    <p className="text-zinc-900">

                      {texto(aluno.email)}

                    </p>

                  </div>

                </div>

                {/* CURSO */}

                <div className="flex items-start gap-3">

                  <Building2 className="w-5 h-5 text-zinc-400 mt-0.5" />

                  <div>

                    <p className="text-zinc-500 text-sm">

                      Curso

                    </p>

                    <p className="text-zinc-900">

                      {texto(aluno.curso)}

                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ESTÁGIO */}

            <div className="bg-white p-6 border border-zinc-200 rounded-lg">

              <div className="flex items-center gap-3 mb-6">

                <Building2 className="w-6 h-6 text-indigo-600" />

                <h2 className="text-zinc-900 text-xl font-semibold">

                  Estágio Atual

                </h2>

              </div>

              <div className="space-y-4 mb-6">

                <div>

                  <p className="text-zinc-500 text-sm mb-1">

                    Empresa

                  </p>

                  <p className="text-zinc-900 font-medium text-lg">

                    {texto(aluno.estagio?.empresa)}

                  </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>

                    <p className="text-zinc-500 text-sm mb-1">

                      Cargo

                    </p>

                    <p className="text-zinc-900">

                      {texto(aluno.estagio?.cargo)}

                    </p>

                  </div>

                  <div>

                    <p className="text-zinc-500 text-sm mb-1">

                      Supervisor

                    </p>

                    <p className="text-zinc-900">

                      {texto(aluno.estagio?.supervisor)}

                    </p>

                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <MapPin className="w-5 h-5 text-zinc-400 mt-0.5" />

                  <div>

                    <p className="text-zinc-500 text-sm mb-1">

                      Endereço

                    </p>

                    <p className="text-zinc-900">

                      {texto(aluno.estagio?.endereco)}

                    </p>

                  </div>

                </div>

              </div>

              {/* TEMPO */}

              <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">

                <div className="flex items-center justify-between mb-3">

                  <div className="flex items-center gap-2">

                    <Clock className="w-5 h-5 text-indigo-600" />

                    <span className="text-zinc-900 font-medium">

                      Tempo Restante

                    </span>

                  </div>

                  <span className="text-2xl font-bold text-indigo-600">

                    {daysRemaining}
                    {' '}
                    dias

                  </span>

                </div>

              </div>

            </div>

            {/* FREQUÊNCIA */}

            <div className="bg-white p-6 border border-zinc-200 rounded-lg">

              <h2 className="text-zinc-900 mb-4 text-xl font-semibold">

                Histórico de Frequência

              </h2>

              <div className="space-y-2">

                {aluno.frequencia?.length ? (

                aluno.frequencia.map(
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

            </div>

          </div>

          {/* DIREITA */}

          <div className="lg:col-span-1">

            <QRScanner
              onScanSuccess={abrirSolicitacaoPorQr}
            />

          </div>

        </div>

      </main>

    </div>

  );

}
