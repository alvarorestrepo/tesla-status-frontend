import { Order } from '@/lib/tesla/types';
import { decodeTaskStatus } from '@/lib/translations/taskStatuses';

export interface FormattedTask {
  key: string;
  label: string;
  status: {
    raw: string | null | undefined;
    name: string;
    color: string;
  };
}

export interface FormattedTasks {
  items: FormattedTask[];
  summary: {
    total: number;
    completed: number;
    pending: number;
    ignored: number;
    progress: number;
  };
}

export function formatTasks(order: Order): FormattedTasks {
  const tasks = order.tasks_status;

  if (!tasks) {
    return {
      items: [],
      summary: {
        total: 0,
        completed: 0,
        pending: 0,
        ignored: 0,
        progress: 0,
      },
    };
  }

  const taskDefinitions = [
    { key: 'registration', label: 'Registro' },
    { key: 'agreements', label: 'Acuerdos' },
    { key: 'financing', label: 'Financiamiento' },
    { key: 'scheduling', label: 'Programación' },
    { key: 'final_payment', label: 'Pago Final' },
  ];

  const items: FormattedTask[] = taskDefinitions.map(def => {
    const status = tasks[def.key as keyof typeof tasks];
    const decoded = decodeTaskStatus(status);
    
    return {
      key: def.key,
      label: def.label,
      status: {
        raw: status,
        name: decoded.name,
        color: decoded.color,
      },
    };
  });

  const completed = items.filter(t => 
    t.status.raw === 'COMPLETE' || t.status.raw?.includes('COMPLETE')
  ).length;
  
  const ignored = items.filter(t => 
    t.status.raw === 'IGNORE'
  ).length;

  const total = items.length;
  const pending = total - completed - ignored;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    items,
    summary: {
      total,
      completed,
      pending,
      ignored,
      progress,
    },
  };
}
