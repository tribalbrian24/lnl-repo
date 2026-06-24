"use client";

import { useState } from "react";

interface WizardClientProps {
  stages: { id: string; label: string }[];
}

export default function WizardClient({ stages }: WizardClientProps) {
  const [label, setLabel] = useState("");
  const [crmLink, setCrmLink] = useState("");
  const [stage, setStage] = useState(stages[0]?.id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label,
          crm_link: crmLink || null,
          initial_stage: stage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create project");
      }

      const newProject = await response.json();
      alert(`Success! Project "${label}" has been launched.`);

      // Redirect to the new project page
      window.location.href = `/projects/${newProject.id}`;
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-background rounded-xl border border-foreground/10 p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          Project Configuration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              Project Name
            </label>
            <input
              required
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Databrks Enterprise Setup"
              className="w-full rounded-md border border-foreground/20 bg-background p-2 text-sm text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              CRM / HubSpot Link
            </label>
            <input
              type="text"
              value={crmLink}
              onChange={(e) => setCrmLink(e.target.value)}
              placeholder="https://hubspot.com/deal/..."
              className="w-full rounded-md border border-foreground/20 bg-background p-2 text-sm text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              Initial Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full rounded-md border border-foreground/20 p-2 text-sm text-foreground bg-background"
              disabled={stages.length === 0}
            >
              {stages.length === 0 ? (
                <option>No stages available</option>
              ) : (
                stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))
              )}
            </select>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Launching..." : "Launch Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
