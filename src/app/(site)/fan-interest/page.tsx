"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, CheckCircle } from "lucide-react";

export default function FanInterestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", interest: "" });

  if (submitted) {
    return (
      <PageContainer className="pt-8">
        <div className="flex flex-col items-center text-center py-16">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-2xl font-display font-bold text-text-primary mb-2">
            You&apos;re In!
          </h1>
          <p className="text-text-secondary max-w-xs">
            We&apos;ll keep you updated on fixtures, highlights, and everything
            Road to Greatness.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-tcl-red/20 flex items-center justify-center">
          <Heart className="h-5 w-5 text-tcl-red" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-text-primary">
            Register as a Fan
          </h1>
          <p className="text-sm text-text-secondary">
            Stay connected to the action
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4 space-y-4">
          <Input
            label="Your Name"
            placeholder="Enter your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Mobile or Email"
            placeholder="Phone number or email"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">
              What excites you most?
            </label>
            <select
              className="w-full h-10 px-3 rounded-lg bg-bg-elevated border border-border-default text-text-primary text-sm"
              value={form.interest}
              onChange={(e) => setForm({ ...form, interest: e.target.value })}
            >
              <option value="">Select...</option>
              <option value="matches">Watching Matches</option>
              <option value="teams">Following Teams</option>
              <option value="zone">Indoor Zone & Activations</option>
              <option value="highlights">Highlights & Content</option>
              <option value="prize">Road to London Story</option>
            </select>
          </div>
          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="consent"
              className="mt-1 accent-tcl-red"
            />
            <label htmlFor="consent" className="text-xs text-text-muted">
              I agree to receive updates about TCL × Arsenal Road to Greatness
            </label>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={() => setSubmitted(true)}
          >
            Register Interest
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
