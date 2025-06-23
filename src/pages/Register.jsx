import React from 'react';
import RegisterForm from '../components/RegisterForm';

const Register = ({ onRegister }) => (
  <main>
    <h2 style={{ textAlign: 'center', marginTop: '2em' }}>Créer un compte</h2>
    <div style={{ maxWidth: 400, margin: '2em auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: '2em' }}>
      <RegisterForm onRegister={onRegister} />
    </div>
  </main>
);

export default Register;
