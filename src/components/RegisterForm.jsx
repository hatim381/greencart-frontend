import { useState } from 'react';
import { auth } from '../services/api';

const RegisterForm = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('consumer');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await auth.register({ email, password, name, role });
      if (res.data && res.data.user) {
        onRegister && onRegister(res.data.user);
      } else if (res.data && res.data.message) {
        setError(res.data.message);
      } else {
        setError('Erreur lors de l’inscription');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Erreur lors de l’inscription');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: 'linear-gradient(120deg, #f0fdf4 0%, #e0ffe6 100%)',
        borderRadius: 16,
        boxShadow: '0 4px 24px #22C55E22',
        padding: '2em 1.5em'
      }}
    >
      <h3 style={{
        color: '#22C55E',
        textAlign: 'center',
        marginBottom: 18,
        fontWeight: 700,
        letterSpacing: 1
      }}>
        Inscription GreenCart
      </h3>
      <label htmlFor="register-name" style={{ fontWeight: 500, color: '#22C55E', marginBottom: 2 }}>Nom</label>
      <input
        id="register-name"
        placeholder="Nom"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={{
          width: '100%',
          marginBottom: 8,
          border: '1px solid #D1D5DB',
          borderRadius: 8,
          padding: '0.8em 1em',
          fontSize: '1em',
          background: '#fff'
        }}
      />
      <label htmlFor="register-email" style={{ fontWeight: 500, color: '#22C55E', marginBottom: 2 }}>Email</label>
      <input
        id="register-email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{
          width: '100%',
          marginBottom: 8,
          border: '1px solid #D1D5DB',
          borderRadius: 8,
          padding: '0.8em 1em',
          fontSize: '1em',
          background: '#fff'
        }}
      />
      <label htmlFor="register-password" style={{ fontWeight: 500, color: '#22C55E', marginBottom: 2 }}>Mot de passe</label>
      <input
        id="register-password"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{
          width: '100%',
          marginBottom: 8,
          border: '1px solid #D1D5DB',
          borderRadius: 8,
          padding: '0.8em 1em',
          fontSize: '1em',
          background: '#fff'
        }}
      />
      <label htmlFor="register-role" style={{ fontWeight: 500, color: '#22C55E', marginBottom: 2 }}>Rôle</label>
      <select
        id="register-role"
        value={role}
        onChange={e => setRole(e.target.value)}
        required
        style={{
          width: '100%',
          marginBottom: 12,
          border: '1px solid #D1D5DB',
          borderRadius: 8,
          padding: '0.8em 1em',
          fontSize: '1em',
          color: '#222',
          background: '#fff'
        }}
      >
        <option value="consumer">Consommateur</option>
        <option value="producer">Producteur</option>
      </select>
      <button
        type="submit"
        className="btn btn-primary"
        style={{
          width: '100%',
          background: 'linear-gradient(90deg, #22C55E 60%, #16A34A 100%)',
          border: 'none',
          color: '#fff',
          fontWeight: 700,
          fontSize: '1.1em',
          borderRadius: 8,
          padding: '0.95em 0',
          marginTop: 8,
          boxShadow: '0 2px 8px #22C55E22',
          letterSpacing: 1
        }}
      >
        Créer mon compte
      </button>
      {error && <div style={{ color: '#e11d48', marginTop: 12, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
    </form>
  );
};

export default RegisterForm;
