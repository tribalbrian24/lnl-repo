

export default function RegistryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8 text-slate-900 dark:text-slate-100">
        {children}
      </main>
    </div>
  );
}
