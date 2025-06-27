import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );
};

Card.Header = function CardHeader({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-slate-200 bg-white',
        className
      )}
    >
      {children}
    </div>
  );
};

Card.Body = function CardBody({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'px-6 py-4 bg-slate-50 border-t border-slate-200',
        className
      )}
    >
      {children}
    </div>
  );
};