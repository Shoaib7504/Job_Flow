"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { AppShell, PageHeader } from "@/app/Components/jobflow/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "Alex Mercer",
      email: "alex@work.com",
      targetRole: "",
      location: "",
      salary: "",
      notifyFollowUps: true,
      notifyInterviews: true,
      weeklyDigest: false,
    },
  });

  const onSubmit = (data) => {
    console.log("Settings form data:", data);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Shape your workspace — how JobFlow addresses you, the roles it watches for, and how it nudges you."
        actions={
          <button
            type="submit"
            form="settings-form"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-transform duration-150 hover:-translate-y-px"
          >
            Save settings
          </button>
        }
      />

      <form
        id="settings-form"
        className="grid gap-8 lg:grid-cols-[1.35fr_1fr]"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-8">
          {/* Profile */}
          <section className="panel p-5 sm:p-6">
            <p className="label-caps">Profile</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              How JobFlow addresses you and where to reach you.
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Name" error={errors.name?.message} id="name">
                <Input
                  id="name"
                  autoComplete="name"
                  {...register("name", { required: "Tell us what to call you." })}
                />
              </Field>
              <Field label="Email" error={errors.email?.message} id="email">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Enter a valid email address.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address.",
                    },
                  })}
                />
              </Field>
            </div>
          </section>

          {/* Search focus */}
          <section className="panel p-5 sm:p-6">
            <p className="label-caps">Search focus</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Defaults applied to every new dossier.
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Target role" error={errors.targetRole?.message} id="targetRole">
                <Input
                  id="targetRole"
                  placeholder="e.g. Senior Product Designer"
                  {...register("targetRole")}
                />
              </Field>
              <Field label="Preferred location" error={errors.location?.message} id="location">
                <Input
                  id="location"
                  placeholder="e.g. Remote, or London"
                  {...register("location")}
                />
              </Field>
              <Field label="Salary expectation" error={errors.salary?.message} id="salary">
                <Input id="salary" placeholder="e.g. £90k" {...register("salary")} />
              </Field>
            </div>
          </section>
        </div>

        {/* Notifications */}
        <section className="panel p-5 sm:p-6 h-fit">
          <p className="label-caps">Notifications</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Choose what deserves your attention.
          </p>
          <ul className="mt-5 space-y-4">
            <Toggle
              label="Follow-up nudges"
              description="Reminders when an application has gone quiet."
              {...register("notifyFollowUps")}
            />
            <Toggle
              label="Interview alerts"
              description="Heads-up before every scheduled interview."
              {...register("notifyInterviews")}
            />
            <Toggle
              label="Weekly digest"
              description="A Monday summary of pipeline momentum."
              {...register("weeklyDigest")}
            />
          </ul>
        </section>
      </form>
    </AppShell>
  );
}

function Field({ label, id, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="label-caps">
        {label}
      </Label>
      <div className={cn(error && "[&_input]:border-destructive")}>{children}</div>
      {error ? (
        <p role="alert" className="animate-rise text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

const Toggle = React.forwardRef(({ label, description, className, ...props }, ref) => {
  return (
    <li className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="relative inline-flex shrink-0">
        <input
          ref={ref}
          type="checkbox"
          className={cn("peer sr-only", className)}
          aria-label={label}
          {...props}
        />
        <span className="h-6 w-10 cursor-pointer rounded-full border border-border bg-surface-2 transition-colors duration-150 peer-checked:border-primary/50 peer-checked:bg-primary/80 peer-focus-visible:ring-2 peer-focus-visible:ring-ring" />
        <span className="pointer-events-none absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-150 peer-checked:translate-x-4" />
      </span>
    </li>
  );
});
Toggle.displayName = "Toggle";