import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { LogOut, Building2, Calendar, Clock, User, Mail, Phone, MapPin } from 'lucide-react';
import QRScanner from './QRScanner';

// Dados mock do aluno
const studentData = {
  nome: 'Ana Silva',
  matricula: '2024001',
  email: 'ana.silva@email.com',
  curso: 'Engenharia de Software',
  periodo: '7º Período',
  estagio: {
  empresa: 'Tech Solutions',
  cargo: 'Desenvolvedor Júnior',
    supervisor: 'Carlos Mendes',
    dataInicio: '01/02/2026',
    dataFim: '31/07/2026',
    endereco: 'Av. Paulista, 1000 - São Paulo/SP',
  },
  frequencia: [
    { data: '13/04/2026', hora: '09:15', status: 'presente' },
    { data: '12/04/2026', hora: '09:10', status: 'presente' },
    { data: '11/04/2026', hora: '09:20', status: 'presente' },
    { data: '10/04/2026', hora: '09:05', status: 'presente' },
    { data: '09/04/2026', hora: '09:30', status: 'presente' },
  ]
};

const calculateDaysRemaining = (endDate: string) => {
  const [day, month, year] = endDate.split('/').map(Number);
  const end = new Date(year, month - 1, day);
  const today = new Date();
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scannedCodes, setScannedCodes] = useState<string[]>([]);

  const handleLogout = () => {
    navigate('/');
  };

  const handleScanSuccess = (decodedText: string) => {
    setScannedCodes((prev) => [...prev, decodedText]);
  };

  const daysRemaining = calculateDaysRemaining(studentData.estagio.dataFim);
  const totalDays = Math.ceil(
    (new Date(2026, 6, 31).getTime() - new Date(2026, 1, 1).getTime()) / (1000 * 60 * 60 * 24)
  );
  const progressPercentage = ((totalDays - daysRemaining) / totalDays) * 100;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-zinc-900">Área do Aluno</h1>
            <p className="text-zinc-600 mt-1">Bem-vindo, {studentData.nome}</p>
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna esquerda - Informações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações pessoais */}
            <div className="bg-white p-6 border border-zinc-200 rounded-lg">
              <h2 className="text-zinc-900 mb-6">Informações Pessoais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-500 text-sm">Nome Completo</p>
                    <p className="text-zinc-900">{studentData.nome}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-500 text-sm">Matrícula</p>
                    <p className="text-zinc-900">{studentData.matricula}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-500 text-sm">Email</p>
                    <p className="text-zinc-900">{studentData.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                 
                  <div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações do estágio */}
            <div className="bg-white p-6 border border-zinc-200 rounded-lg">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-6 h-6 text-indigo-600" />
                <h2 className="text-zinc-900">Estágio Atual</h2>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-zinc-500 text-sm mb-1">Empresa</p>
                  <p className="text-zinc-900 font-medium text-lg">{studentData.estagio.empresa}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-zinc-500 text-sm mb-1">Cargo</p>
                    <p className="text-zinc-900">{studentData.estagio.cargo}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-sm mb-1">Supervisor</p>
                    <p className="text-zinc-900">{studentData.estagio.supervisor}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-500 text-sm mb-1">Endereço</p>
                    <p className="text-zinc-900">{studentData.estagio.endereco}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <span className="text-zinc-900 font-medium">Tempo Restante</span>
                  </div>
                  <span className="text-2xl font-bold text-indigo-600">{daysRemaining} dias</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-zinc-600">
                    <span>Início: {studentData.estagio.dataInicio}</span>
                    <span>Término: {studentData.estagio.dataFim}</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 overflow-hidden border border-indigo-200">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-indigo-700 font-medium">
                    {progressPercentage.toFixed(0)}% concluído
                  </p>
                </div>
              </div>
            </div>

            {/* Histórico de frequência */}
            <div className="bg-white p-6 border border-zinc-200 rounded-lg">
              <h2 className="text-zinc-900 mb-4">Histórico de Frequência</h2>
              <div className="space-y-2">
                {studentData.frequencia.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-200"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-zinc-400" />
                      <div>
                        <p className="text-zinc-900">{item.data}</p>
                        <p className="text-zinc-500 text-sm">{item.hora}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Presente
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna direita - Scanner QR */}
          <div className="lg:col-span-1">
            <QRScanner onScanSuccess={handleScanSuccess} />
          </div>
        </div>
      </main>
    </div>
  );
}
