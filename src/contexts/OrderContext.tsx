'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@/lib/tesla/types';

interface OrderContextType {
  order: Order | null;
  orders: Order[];
  userData: {
    name: string;
    email: string;
  };
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  selectedIndex: number;
  selectOrder: (index: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

function getStorageKey(email: string): string {
  return `tesla_selected_vehicle_index_${email}`;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived order (backward compatibility)
  const order = orders[selectedIndex] || null;

  const selectOrder = (index: number) => {
    if (index >= 0 && index < orders.length) {
      setSelectedIndex(index);
      // Persist to localStorage
      if (userData.email) {
        localStorage.setItem(getStorageKey(userData.email), index.toString());
      }
    }
  };

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
        setOrders(data);
        
        // Extract user data from first order
        const firstOrder = data[0];
        const firstName = firstOrder.first_name?.trim() || '';
        const lastName = firstOrder.last_name?.trim() || '';
        const fullName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName;
        const email = firstOrder.email_address || localStorage.getItem('tesla_user_email') || '';
        
        setUserData({
          name: fullName || email.split('@')[0] || 'Usuario',
          email: email
        });

        // Restore selected index from localStorage if available
        if (email) {
          const savedIndex = localStorage.getItem(getStorageKey(email));
          if (savedIndex !== null) {
            const parsedIndex = parseInt(savedIndex, 10);
            if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < data.length) {
              setSelectedIndex(parsedIndex);
            }
          }
        }
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
        orders,
        userData, 
        loading, 
        error,
        refetch: fetchOrderData,
        selectedIndex,
        selectOrder
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
