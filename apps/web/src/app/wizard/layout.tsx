import { ThemeToggle } from '@/components/theme-toggle';

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 p-8">
      <header className="mb-8 border-b border-foreground/10 pb-6 flex justify-between items-center">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-foreground">Project Inception Wizard</h1>
          <p className="text-foreground/60">Follow the steps to onboard a new AI project into the lifecycle.</p>
        </div>
        <ThemeToggle />
      </header>
      <div className="max-w-3xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
