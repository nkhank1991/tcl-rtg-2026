"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaButtons() {
  return (
    <div className="flex flex-row items-center gap-3">
      <Button asChild className="bg-tcl-red text-white hover:bg-tcl-red/90">
        <Link href="/apply">Apply as Captain</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/fan-interest">I&apos;m a Fan</Link>
      </Button>
    </div>
  );
}
