"use client"

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { refreshUser, updateRole, rolesList, user, stagesList } = useAuth();

  const roleValue = user?.role || 'guest';

  const handleRoleChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as any;
    await updateRole(newRole);
  }, [updateRole]);

  const handleStageChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stageId = e.target.value;
    const role = user?.role || 'guest';
    await updateRole(role, stageId);
  }, [updateRole, user]);

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Create Project',
      href: '/wizard/create',
      icon: PlusCircle,
    },
    {
      label: 'Project Registry',
      href: '/registry',
    },
  ];
  useEffect(() => {
    const handleFocus = () => refreshUser();

    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handleFocus); // key for back/forward cache

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handleFocus);
    };
  }, []);

  return (
    <aside className="w-64 border-r border-foreground/10 bg-background p-6 flex flex-col">
      <h2 className="mb-6 text-xl font-bold text-foreground">ALCP Control</h2>
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname === item.href
                ? 'bg-foreground/10 text-foreground'
                : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'
            }`}
          >
            {item.icon && <item.icon className="inline-block w-4 h-4 mr-2" />}
            {item.label}
          </Link>
        ))}
        <div className="mt-auto pt-4 border-t border-foreground/10 space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="role-select" className="text-xs font-medium text-foreground/60 px-3">
              Role
            </label>
            <select
              id="role-select"
              defaultValue={roleValue}
              className="bg-transparent text/sm px-3 py-2 rounded-md border border-foreground/10 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-colors"
              onChange={handleRoleChange}
            >
              {rolesList.map((role) => (
                <option
                  key={role}
                  value={role}
                  // selected={roleValue === role}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="stage-select" className="text-xs font-medium text-foreground/60 px-3">
              Stage
            </label>
            <select
              id="stage-select"
              // there is an issue that a user can have many accesses but a project only has one stage
              defaultValue={(user?.stageAccessList ?? []) as unknown as string}
              className="bg-transparent text-sm px-3 py-2 rounded-md border border-foreground/10 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-colors"
              onChange={handleStageChange}
            >
              <option value="">None</option>
              {stagesList.map((stage) => (
                <option
                  key={stage.id}
                  value={stage.id}
                  // selected={(user?.stageAccessList || []).includes(stage.id)}
                >
                  {stage.label}
                </option>
              ))}
            </select>
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </aside>
  );
}
