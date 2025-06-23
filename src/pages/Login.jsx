import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const Login = ({ onLogin }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (u) => {
    setUser(u);
    onLogin && onLogin(u);
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Appel API pour se connecter
      // Si succès, appeler handleLogin
    } catch (err) {
      let msg = "Identifiants incorrects.";
      if (err.response && err.response.data && (err.response.data.error || err.response.data.message)) {
        msg = err.response.data.error || err.response.data.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (user) return null; // Optionnel : ou afficher un loader

  return (
    <main>
      <h2 style={{ textAlign: 'center', marginTop: '2em' }}>Connexion</h2>
      <div style={{
        maxWidth: 400,
        margin: '2em auto',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px #0001',
        padding: '2em'
      }}>
        <LoginForm onLogin={handleLogin} />
        {error && (
          <div style={{ color: "#e11d48", marginBottom: 12 }}>
            {error}
          </div>
        )}
      </div>
    </main>
  );
};

export default Login;
