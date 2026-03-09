'use client';

import { OrderProvider, useOrder } from '@/contexts/OrderContext';
import { SidebarProvider } from '@/components/layout/SidebarContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { userData, order, orders, selectedIndex, selectOrder, loading } = useOrder();

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
    <div className="min-h-screen bg-background">
      <Sidebar 
        userName={userData.name} 
        userEmail={userData.email}
        orders={orders}
        selectedIndex={selectedIndex}
        onSelectOrder={selectOrder}
      />
      <MobileHeader 
        orderReference={order?.reference_number}
        orders={orders}
        selectedIndex={selectedIndex}
        onSelectOrder={selectOrder}
      />
      
      <main className="md:ml-[250px] min-h-screen pt-14 md:pt-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <OrderProvider>
      <SidebarProvider>
        <DashboardContent>
          {children}
        </DashboardContent>
      </SidebarProvider>
    </OrderProvider>
  );
}
