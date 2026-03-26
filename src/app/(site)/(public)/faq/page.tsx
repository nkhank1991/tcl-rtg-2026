"use client";

import { PageContainer } from "@/components/layout/page-container";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import type { FaqItem } from "@/types";

export default function FaqPage() {
  const { data, isLoading } = useQuery<{ items: FaqItem[] }>({
    queryKey: ["faq"],
    queryFn: async () => {
      const res = await fetch("/api/faq");
      if (!res.ok) throw new Error("Failed to fetch FAQ");
      return res.json();
    },
  });

  const faqItems = data?.items ?? [];

  const grouped = faqItems.reduce<Record<string, FaqItem[]>>((acc, item) => {
    const cat = item.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  if (isLoading) {
    return (
      <PageContainer className="pt-6">
        <h1 className="text-lg font-display font-bold text-text-primary flex items-center mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-tcl-red inline-block mr-2 mb-0.5" />
          FAQ
        </h1>
        <div className="space-y-3 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-bg-elevated animate-pulse" />
          ))}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-6">
      <h1 className="text-lg font-display font-bold text-text-primary flex items-center mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-tcl-red inline-block mr-2 mb-0.5" />
        FAQ
      </h1>

      <Accordion type="single" collapsible>
        {categories.map((category) => (
          <div key={category}>
            <p className="text-[11px] uppercase tracking-wide text-text-muted mt-6 mb-2 font-medium">
              {category}
            </p>
            {grouped[category].map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-[13px] py-3">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[12px] text-text-secondary">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </div>
        ))}
      </Accordion>
    </PageContainer>
  );
}
