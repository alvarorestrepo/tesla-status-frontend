'use client';

import { useState } from 'react';

export default function TeslaLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    
    // Redirigir a la página de autenticación con popup
    window.location.href = '/auth/tesla-popup';
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      style={{
        padding: '12px 24px',
        fontSize: '16px',
        backgroundColor: '#cc0000',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      {isLoading ? 'Conectando...' : 'Conectar con Tesla'}
    </button>
  );
}