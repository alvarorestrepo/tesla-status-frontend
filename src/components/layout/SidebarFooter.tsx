'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SidebarFooter() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('tesla_access_token');
    localStorage.removeItem('tesla_refresh_token');
    localStorage.removeItem('tesla_user_email');
    router.push('/');
  };

  return (
    <div className="p-4 border-t border-gray-800">
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="w-full gap-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
      >
        <LogOut className="w-4 h-4" />
        Cerrar Sesión
      </Button>
      
      <p className="text-center text-gray-500 text-xs mt-3">
        v1.0.0 • Tesla Status
      </p>
    </div>
  );
}
