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
import { withBasePath } from "@/lib/site";

const RECIPIENT = "sudosapient@gmail.com";
const BUDGETS = ["<$10k", "$10–25k", "$25–50k", "$50k+", "Not sure"];
const TIMELINES = ["As soon as possible", "Within 1 month", "1–3 months", "3+ months", "Exploring"];

function composeGmailUrl({
  name,
  email,
  company,
  website,
  project,
  budget,
  timeline,
}: Record<string, string>) {
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || "Not provided"}`,
    `Website: ${website || "Not provided"}`,
    `Budget: ${budget || "Not provided"}`,
    `Timeline: ${timeline || "Not provided"}`,
    "",
    "What I want to build:",
    project,
  ].join("\n");

  const query = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: RECIPIENT,
    su: `New project enquiry — ${company || name}`,
    body,
  });

  return `https://mail.google.com/mail/?${query.toString()}`;
}

export function ContactForm() {
  const [opened, setOpened] = React.useState(false);
  const [budget, setBudget] = React.useState<string | undefined>();
  const [timeline, setTimeline] = React.useState<string | undefined>();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const url = composeGmailUrl({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      website: String(data.get("website") ?? ""),
      project: String(data.get("project") ?? ""),
      budget: budget ?? "",
      timeline: timeline ?? "",
    });

    // This runs directly from the submit interaction, so browsers allow the
    // compose tab. The visible fallback below covers restrictive popup settings.
    window.open(url, "_blank", "noopener,noreferrer");
    setOpened(true);
  }

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

      <Field name="project" label="WHAT DO YOU WANT TO BUILD?">
        <Textarea
          name="project"
          required
          minLength={20}
          placeholder="What is the problem, who is it for, and what should be true when the first version ships?"
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
          Your details are added to a draft addressed to Sudo Sapient. We do not store this form on
          the website. See our{" "}
          <a
            href={withBasePath("/privacy/")}
            className="underline decoration-white/40 underline-offset-2 hover:text-white"
          >
            privacy policy
          </a>
          .
        </p>
        <Button type="submit" variant="solid" size="lg">
          Open Gmail →
        </Button>
      </div>

      {opened && (
        <p role="status" aria-live="polite" className="text-sm leading-relaxed text-white/75">
          Gmail compose opened in a new tab. If it did not open, email{" "}
          <a href={`mailto:${RECIPIENT}`} className="underline underline-offset-2">
            {RECIPIENT}
          </a>
          .
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
