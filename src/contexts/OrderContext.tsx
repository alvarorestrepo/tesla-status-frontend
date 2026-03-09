'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@/lib/tesla/types';

interface OrderContextType {
  order: Order | null;
  userData: {
    name: string;
    email: string;
  };
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderData = async () => {
    const token = localStorage.getItem('tesla_access_token');
    if (!token) {
      router.push('/');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('tesla_access_token');
          localStorage.removeItem('tesla_refresh_token');
          localStorage.removeItem('tesla_user_email');
          router.push('/');
          return;
        }
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      
      if (data && data.length > 0) {
        const orderData = data[0];
        setOrder(orderData);
        
        // Extraer datos del usuario de la orden
        const firstName = orderData.first_name?.trim() || '';
        const lastName = orderData.last_name?.trim() || '';
        const fullName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName;
        const email = orderData.email_address || localStorage.getItem('tesla_user_email') || '';
        
        setUserData({
          name: fullName || email.split('@')[0] || 'Usuario',
          email: email
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar los datos del pedido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [router]);

  return (
    <OrderContext.Provider 
      value={{ 
        order, 
        userData, 
        loading, 
        error,
        refetch: fetchOrderData 
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder debe usarse dentro de un OrderProvider');
  }
  return context;
}
