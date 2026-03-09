'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SidebarProvider } from '@/components/layout/SidebarContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Order } from '@/lib/tesla/types';

export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tesla_access_token');
    if (!token) {
      router.push('/');
      return;
    }

    // Fetch orders
    fetch('/api/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
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
      return res.json();
    })
    .then(data => {
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
      setLoading(false);
    })
    .catch(err => {
      console.error('Error:', err);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E31937] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Sidebar userName={userData.name} userEmail={userData.email} />
        <MobileHeader orderReference={order?.reference_number} />
        
        <main className="md:ml-[250px] min-h-screen pt-14 md:pt-0">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
