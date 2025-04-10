import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-start py-1">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
      </div>
      {actions && <div className="ml-4">{actions}</div>}
    </div>
  );
} 