"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { OpportunityMap } from "@/app/Components/jobflow/OpportunityMap";
import Logo from "@/app/Components/Logo";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth, useRegister } from "@/hooks/use-auth";

export default function RegisterPage() {
  const [done, setDone] = useState(false);
  const router = useRouter();
  const { login: persistUser } = useAuth();
  const register = useRegister();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    register.mutate(
      { name: data.name, email: data.email, password: data.password },
      {
        onSuccess: (result) => {
          persistUser(result);
          setDone(true);
          toast.success("Workspace created — welcome aboard.");
          router.push("/dashboard");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to create account");
        },
      }
    );
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_1fr]">
      {/* Editorial branding side */}
      <section className="relative hidden flex-col justify-between border-r border-border paper-grid px-12 py-12 lg:flex">
        <Logo />

        <div className="max-w-lg">
          <p className="label-caps animate-rise">Career operating system</p>
          <h1 className="mt-5 font-display text-[2.9rem] font-semibold leading-[1] tracking-[-0.03em] animate-rise">
            BUILD YOUR NEXT OPPORTUNITY.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Bring every application, interview, and deadline into one place.
          </p>
          <div className="mt-14 max-w-md">
            <OpportunityMap compact />
          </div>
        </div>

        <p className="num text-[11px] text-muted-foreground">
          Every application is a journey forward.
        </p>
      </section>

      {/* Form side */}
      <section className="flex flex-col justify-center px-5 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-sm">
          <Logo className="mb-10 lg:hidden" />

          <div className="lg:hidden">
            <OpportunityMap compact className="mb-10" />
          </div>

          <div className="mb-8 flex gap-1 rounded-md border border-border p-1">
            <Link
              href="/login"
              className="label-caps flex-1 rounded-[8px] px-3 py-2 text-center transition-colors duration-150 hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              aria-current="page"
              className="label-caps flex-1 rounded-[8px] bg-surface-2 px-3 py-2 text-center text-foreground transition-colors duration-150"
            >
              Create account
            </Link>
          </div>

          <div className="animate-rise">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Create your account
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Start your workspace — it takes less than a minute.
            </p>
          </div>

          <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Field label="Name" error={errors.name?.message} id="name">
              <Input
                id="name"
                placeholder="Alex Mercer"
                autoComplete="name"
                {...registerField("name", { required: "Tell us what to call you." })}
              />
            </Field>
            <Field label="Email" error={errors.email?.message} id="email">
              <Input
                id="email"
                type="email"
                placeholder="you@work.com"
                autoComplete="email"
                {...registerField("email", {
                  required: "Enter a valid email address.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
              />
            </Field>
            <Field
              label="Password"
              error={errors.password?.message}
              id="password"
              hint="At least 8 characters"
            >
              <PasswordInput
                id="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...registerField("password", {
                  required: "Use at least 8 characters.",
                  minLength: { value: 8, message: "Use at least 8 characters." },
                })}
              />
            </Field>

            <button
              type="submit"
              disabled={register.isPending}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform duration-150 hover:-translate-y-px active:translate-y-0 disabled:opacity-70"
            >
              {register.isPending && <Loader2 className="size-4 animate-spin" />}
              Create your account
            </button>

            {done && (
              <p className="flex items-center justify-center gap-1.5 text-sm text-success animate-fade">
                <Check className="size-4" strokeWidth={2.25} />
                Workspace created — welcome aboard.
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-foreground underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground">
              Continue to the workspace
            </Link>
          </p>
        </div>
      </section>
    </div>
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