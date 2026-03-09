'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick?: () => void;
}

export function SidebarItem({ id, label, icon: Icon, isActive, onClick }: SidebarItemProps) {
  return (
    <li>
      <Link
        href={`/dashboard/${id}`}
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          "hover:bg-gray-800",
          isActive && "bg-[#E31937] text-white hover:bg-[#c91630]",
          !isActive && "text-gray-300"
        )}
        aria-current={isActive ? 'page' : undefined}
        role="menuitem"
      >
        <Icon className={cn("w-4 h-4 shrink-0", isActive && "text-white")} />
        <span className="truncate">{label}</span>
      </Link>
    </li>
  );
}
