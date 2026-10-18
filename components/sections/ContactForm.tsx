"use client";

import * as React from "react";
import { motion } from "framer-motion";
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
import { CTA_LABEL, withBasePath } from "@/lib/site";
import { ContactSuccessScene } from "@/components/scenes/ContactSuccessScene";

const RECIPIENT = "sudosapient@gmail.com";
const BUDGETS = ["<$10k", "$10–25k", "$25–50k", "$50k+", "Not sure"];
const TIMELINES = ["As soon as possible", "Within 1 month", "1–3 months", "3+ months", "Exploring"];

// Formspree form ID (https://formspree.io). Without it the form falls back to email.
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [budget, setBudget] = React.useState<string | undefined>();
  const [timeline, setTimeline] = React.useState<string | undefined>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    data.set("budget", budget ?? "Not provided");
    data.set("timeline", timeline ?? "Not provided");
    data.set("_subject", `New transformation enquiry — ${data.get("company") || data.get("name")}`);

    if (!FORMSPREE_ID) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") return <ContactSuccessScene />;

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="name" label="NAME">
          <Input name="name" required minLength={2} autoComplete="name" placeholder="Your name" />
        </Field>
        <Field name="email" label="WORK EMAIL">
          <Input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
          />
        </Field>
        <Field name="company" label="COMPANY (OPTIONAL)">
          <Input name="company" autoComplete="organization" placeholder="Company name" />
        </Field>
        <Field name="website" label="WEBSITE (OPTIONAL)">
          <Input
            type="url"
            name="website"
            inputMode="url"
            autoComplete="url"
            placeholder="https://company.com"
          />
        </Field>
      </div>

      <Field name="project" label="WHAT SHOULD AI CHANGE?">
        <Textarea
          name="project"
          required
          minLength={20}
          placeholder="How does the company run today, where does work pile up, and what would AI-native look like for you?"
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="budget" label="BUDGET (OPTIONAL)">
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger id="budget" aria-label="Budget range">
              <SelectValue placeholder="Pick a range" />
            </SelectTrigger>
            <SelectContent>
              {BUDGETS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field name="timeline" label="TARGET TIMELINE (OPTIONAL)">
          <Select value={timeline} onValueChange={setTimeline}>
            <SelectTrigger id="timeline" aria-label="Target timeline">
              <SelectValue placeholder="Pick a timeline" />
            </SelectTrigger>
            <SelectContent>
              {TIMELINES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 border-t border-white/20 pt-5 sm:flex-row sm:items-center">
        <p className="max-w-sm text-xs leading-relaxed text-white/55">
          Your details go straight to the Sudo Sapient team and are used only to reply to you. See
          our{" "}
          <a
            href={withBasePath("/privacy/")}
            className="underline decoration-white/40 underline-offset-2 hover:text-white"
          >
            privacy policy
          </a>
          .
        </p>
        <Button type="submit" variant="solid" size="lg" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : `${CTA_LABEL} →`}
        </Button>
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm leading-relaxed text-white">
          The form could not be sent. Email us directly at{" "}
          <a href={`mailto:${RECIPIENT}`} className="underline underline-offset-2">
            {RECIPIENT}
          </a>{" "}
          and we will reply within one working day.
        </p>
      )}
    </motion.form>
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
