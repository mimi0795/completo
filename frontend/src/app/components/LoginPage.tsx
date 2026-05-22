import { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  User,
  Lock,
  GraduationCap,
  Shield,
  UserPlus
} from 'lucide-react';

export default function LoginPage() {

  const navigate = useNavigate();

  /* =========================================
     TIPOS DE LOGIN
  ========================================= */

  const [loginType, setLoginType] = useState<
    'admin' | 'entrada' | 'portaria'
  >('admin');

  /* =========================================
     LOGIN OU CADASTRO
  ========================================= */

  const [isCadastro, setIsCadastro] =
    useState(false);

  /* =========================================
     CAMPOS
  ========================================= */

  const [nome, setNome] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] = useState('');

  /* =========================================
     URL DO BACK-END
  ========================================= */
  const API = "https://completo-a3yj.onrender.com/";
  console.log("API:", API);

  /* =========================================
     ENVIAR
  ========================================= */

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError('');

    try {

      let rota = '';

      /* =====================================
         CADASTRO
      ===================================== */

      if (isCadastro) {

        // ADMIN

        if (loginType === 'admin') {

          rota = `${API}admin/cadastro`;

        }

        // PORTEIRO

        else if (
          loginType === 'portaria'
        ) {

          rota =
            `${API}porteiro/cadastro`;

        }

        // ALUNO NÃO PODE CADASTRAR

        else {

          setError(
            'Cadastro de aluno desativado'
          );

          return;

        }

        /* =====================================
           REQUISIÇÃO CADASTRO
        ===================================== */

        const resposta = await fetch(
          rota,
          {

            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

              mode: 'cors',

            body: JSON.stringify({

              nome,

              email,

              senha: password

            })

          }
        );

        const dados =
          await resposta.json();

        if (!resposta.ok) {

          setError(
            dados.msg ||
            'Erro no cadastro'
          );

          return;

        }

        alert(
          'Cadastro realizado com sucesso'
        );

        setNome('');
        setEmail('');
        setPassword('');

        setIsCadastro(false);

        return;

      }

      /* =====================================
         LOGIN ADMIN
      ===================================== */

      if (loginType === 'admin') {

        rota = `${API}admin/login`;

      }

      /* =====================================
         LOGIN PORTEIRO
      ===================================== */

      else if (
        loginType === 'portaria'
      ) {

        rota =
          `${API}porteiro/login`;

      }

      /* =====================================
         LOGIN ALUNO
      ===================================== */

      else {

        rota = `${API}aluno/login`;

      }

      /* =====================================
         REQUISIÇÃO LOGIN
      ===================================== */

      const resposta = await fetch(
        rota,
        {

          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },
            mode: 'cors',

          body: JSON.stringify({

            email,

            senha: password

          })

        }
      );

      const dados =
        await resposta.json();

      /* =====================================
         ERRO LOGIN
      ===================================== */

      if (!resposta.ok) {

        setError(
          dados.msg ||
          'Login inválido'
        );

        return;

      }

      /* =====================================
         SALVAR TOKEN
      ===================================== */

      if (loginType === 'admin') {

        localStorage.setItem(
          'tokenAdmin',
          dados.token
        );

        localStorage.setItem(
          'admin',
          JSON.stringify(
            dados.admin
          )
        );

      }

      else if (
        loginType === 'portaria'
      ) {

        localStorage.setItem(
          'tokenPorteiro',
          dados.token
        );

        localStorage.setItem(
          'porteiro',
          JSON.stringify(
            dados.porteiro
          )
        );

      }

      else {

        localStorage.setItem(
          'tokenAluno',
          dados.token
        );

        localStorage.setItem(
          'aluno',
          JSON.stringify(
            dados.aluno
          )
        );

      }

      /* =====================================
         REDIRECIONAMENTO
      ===================================== */

      if (loginType === 'admin') {

        navigate('/admin');

      }

      else if (
        loginType === 'portaria'
      ) {

        navigate('/portaria');

      }

      else {

        navigate('/entrada');

      }

    } catch (error) {

      console.log(error);

      setError(
        'Erro ao conectar com servidor'
      );

    }

  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* TOPO */}

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">

            <GraduationCap className="w-8 h-8 text-white" />

          </div>

          <h1 className="text-3xl font-bold text-zinc-900 mb-2">

            Sistema Escolar

          </h1>

          <p className="text-zinc-600">

            Login e Cadastro

          </p>

        </div>

        {/* CARD */}

        <div className="bg-white rounded-xl shadow-lg p-8">

          {/* BOTÕES */}

          <div className="grid grid-cols-3 gap-3 mb-6">

            {/* ADMIN */}

            <button
              type="button"
              onClick={() =>
                setLoginType('admin')
              }
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 ${
                loginType === 'admin'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-zinc-200 text-zinc-600'
              }`}
            >

              <Shield className="w-5 h-5" />

              Admin

            </button>

            {/* ALUNO */}

            <button
              type="button"
              onClick={() =>
                setLoginType('entrada')
              }
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 ${
                loginType === 'entrada'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-zinc-200 text-zinc-600'
              }`}
            >

              <User className="w-5 h-5" />

              Aluno

            </button>

            {/* PORTEIRO */}

            <button
              type="button"
              onClick={() =>
                setLoginType('portaria')
              }
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 ${
                loginType === 'portaria'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-zinc-200 text-zinc-600'
              }`}
            >

              <Shield className="w-5 h-5" />

              Porteiro

            </button>

          </div>

          {/* FORMULÁRIO */}

          <form onSubmit={handleSubmit}>

            {/* NOME */}

            {isCadastro && (

              <div className="mb-4">

                <label className="block text-zinc-700 mb-2">

                  Nome

                </label>

                <div className="relative">

                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />

                  <input
                    type="text"
                    value={nome}
                    onChange={(e) =>
                      setNome(
                        e.target.value
                      )
                    }
                    className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    placeholder="Seu nome"
                    required
                  />

                </div>

              </div>

            )}

            {/* EMAIL */}

            <div className="mb-4">

              <label className="block text-zinc-700 mb-2">

                Email

              </label>

              <div className="relative">

                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  placeholder="email@escola.com"
                  required
                />

              </div>

            </div>

            {/* SENHA */}

            <div className="mb-6">

              <label className="block text-zinc-700 mb-2">

                Senha

              </label>

              <div className="relative">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  placeholder="••••••"
                  required
                />

              </div>

            </div>

            {/* ERRO */}

            {error && (

              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">

                {error}

              </div>

            )}

            {/* BOTÃO */}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition"
            >

              {isCadastro
                ? 'Cadastrar'
                : 'Entrar'}

            </button>

          </form>

          {/* BOTÃO CADASTRO */}

          {loginType !== 'entrada' && (

            <button
              type="button"
              onClick={() =>
                setIsCadastro(
                  !isCadastro
                )
              }
              className="w-full mt-4 border border-indigo-600 text-indigo-600 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-50"
            >

              <UserPlus className="w-5 h-5" />

              {isCadastro
                ? 'Já tenho conta'
                : 'Criar conta'}

            </button>

          )}

        </div>

      </div>

    </div>

  );

}
