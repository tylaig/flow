import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface SignUpFormProps {
  onSuccess?: () => void;
  onToggleMode?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess, onToggleMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');

  const { signUp } = useAuth();

  const getErrorMessage = (error: any) => {
    if (error?.message?.includes('User already registered')) {
      return 'Este email já está cadastrado. Tente fazer login ou use outro email.';
    }
    if (error?.message?.includes('Password should be at least')) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }
    if (error?.message?.includes('Invalid email')) {
      return 'Email inválido. Verifique o formato do email.';
    }
    return error?.message || 'Erro desconhecido. Tente novamente.';
  };

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 6,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /\d/.test(password),
    };
    return requirements;
  };

  const passwordRequirements = validatePassword(password);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, name);

    if (error) {
      setError(getErrorMessage(error));
    } else {
      setSuccess('Conta criada com sucesso! Verifique seu email para confirmar a conta antes de fazer login.');
      setError('');
      // Não chama onSuccess imediatamente, pois o usuário precisa confirmar o email
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Criar nova conta
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {password && (
              <div className="mt-2 space-y-1">
                <div className={`text-xs flex items-center ${passwordRequirements.length ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordRequirements.length ? 'bg-green-500' : 'bg-red-500'}`} />
                  Pelo menos 6 caracteres
                </div>
                <div className={`text-xs flex items-center ${passwordRequirements.hasLetter ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordRequirements.hasLetter ? 'bg-green-500' : 'bg-red-500'}`} />
                  Pelo menos uma letra
                </div>
                <div className={`text-xs flex items-center ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordRequirements.hasNumber ? 'bg-green-500' : 'bg-red-500'}`} />
                  Pelo menos um número
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  confirmPassword && password !== confirmPassword 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-600 text-xs mt-1">As senhas não coincidem</p>
            )}
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-green-700 text-sm">
                  {success}
                  <div className="mt-2 text-xs text-green-600">
                    <p>Próximos passos:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Verifique sua caixa de entrada</li>
                      <li>Clique no link de confirmação</li>
                      <li>Retorne aqui para fazer login</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-red-700 text-sm">
                  {error}
                  {error.includes('já está cadastrado') && (
                    <div className="mt-2 text-xs text-red-600">
                      <p>Opções:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Faça login com este email</li>
                        <li>Use outro endereço de email</li>
                        <li>Recupere sua senha se esqueceu</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>

          {onToggleMode && (
            <div className="text-center">
              <span className="text-gray-600 text-sm">Já tem uma conta? </span>
              <button
                type="button"
                onClick={onToggleMode}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Fazer login
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;