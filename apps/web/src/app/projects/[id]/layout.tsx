import React from 'react';

export default function ProjectDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 p-8">
      {children}
    </div>
  );
}
