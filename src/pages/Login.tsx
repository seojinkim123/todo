import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const Login = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (user) navigate('/');
    // eslint-disable-next-line
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (isSignUp) {
      const result = await signUp(email, password);
      if (result?.error) setError(result.error.message || '회원가입 실패');
      else setIsSignUp(false);
    } else {
      const result = await signIn(email, password);
      if (result?.error) setError(result.error.message || '로그인 실패');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
      <div className="card w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">{isSignUp ? '회원가입' : '로그인'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="input"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            className="input"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
          </button>
        </form>
        <div className="mt-4 text-center">
          {isSignUp ? (
            <>
              이미 계정이 있으신가요?{' '}
              <button className="text-blue-600 underline" onClick={() => setIsSignUp(false)}>
                로그인
              </button>
            </>
          ) : (
            <>
              계정이 없으신가요?{' '}
              <button className="text-blue-600 underline" onClick={() => setIsSignUp(true)}>
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 