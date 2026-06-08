"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { ContactSuccessScene } from "@/components/scenes/ContactSuccessScene";

const BUDGETS = ["<$10k", "$10–25k", "$25–50k", "$50k+", "Not sure"];

export function ContactForm() {
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [budget, setBudget] = React.useState<string | undefined>(undefined);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      project: String(data.get("project") ?? ""),
      budget: budget ?? "",
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit_failed");
      setSuccess(true);
      form.reset();
      setBudget(undefined);
    } catch {
      setError("Something broke on our side. Email sudosapient@gmail.com.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence mode="wait">
      {success ? (
        <ContactSuccessScene key="success" />
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex flex-col gap-6"
        >
          <Field name="name" label="NAME">
            <Input name="name" required autoComplete="name" placeholder="Your name" />
          </Field>
          <Field name="email" label="EMAIL">
            <Input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
            />
          </Field>
          <Field name="project" label="WHAT DO YOU WANT TO BUILD?">
            <Textarea
              name="project"
              required
              placeholder="A few sentences is enough. What is it? Who's it for? What does shipped look like?"
            />
          </Field>
          <Field name="budget" label="BUDGET (OPTIONAL)">
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger>
                <SelectValue placeholder="Pick a range" />
              </SelectTrigger>
              <SelectContent>
                {BUDGETS.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {error && (
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-warn">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <TechLabel>{"// SUBMIT"}</TechLabel>
            <Button type="submit" variant="solid" size="lg" disabled={submitting}>
              {submitting ? "Sending…" : "Send →"}
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Field({
  name,
  label,
  children,
}: {
  name: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={name} className="flex flex-col gap-2">
      <TechLabel underline>{label}</TechLabel>
      {children}
    </label>
  );
}
