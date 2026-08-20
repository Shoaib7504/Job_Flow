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
import { useAuth, useLogin } from "@/hooks/use-auth";

export default function LoginPage() {
  const [done, setDone] = useState(false);
  const router = useRouter();
  const { login: persistUser } = useAuth();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (result) => {
          persistUser(result);
          setDone(true);
          toast.success("Welcome back.");
          router.push("/dashboard");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to sign in");
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
            YOUR NEXT OPPORTUNITY
            <br />
            <span className="text-muted-foreground">IS ALREADY MOVING.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            A calm command center for your search — journey mapping, interviews and career signals.
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
              aria-current="page"
              className="label-caps flex-1 rounded-[8px] bg-surface-2 px-3 py-2 text-center text-foreground transition-colors duration-150"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="label-caps flex-1 rounded-[8px] px-3 py-2 text-center transition-colors duration-150 hover:text-foreground"
            >
              Create account
            </Link>
          </div>

          <div className="animate-rise">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Welcome back</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Continue managing your job search.
            </p>
          </div>

          <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Field label="Email" error={errors.email?.message} id="email">
              <Input
                id="email"
                type="email"
                placeholder="you@work.com"
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
            <Field label="Password" error={errors.password?.message} id="password">
              <PasswordInput
                id="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password", {
                  required: "Use at least 8 characters.",
                  minLength: { value: 8, message: "Use at least 8 characters." },
                })}
              />
            </Field>

            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                {...register("remember")}
                className="size-3.5 accent-[var(--color-primary)]"
              />
              Remember me on this device
            </label>

            <button
              type="submit"
              disabled={login.isPending}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform duration-150 hover:-translate-y-px active:translate-y-0 disabled:opacity-70"
            >
              {login.isPending && <Loader2 className="size-4 animate-spin" />}
              Sign in
            </button>

            {done && (
              <p className="flex items-center justify-center gap-1.5 text-sm text-success animate-fade">
                <Check className="size-4" strokeWidth={2.25} />
                Welcome back.
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-foreground underline-offset-4 hover:underline">
              Create account
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