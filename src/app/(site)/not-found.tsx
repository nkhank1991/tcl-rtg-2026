import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <PageContainer className="pt-16">
      <div className="flex flex-col items-center text-center">
        <div className="text-6xl font-display font-bold text-tcl-red mb-4">
          404
        </div>
        <h1 className="text-xl font-display font-semibold text-text-primary mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-text-secondary mb-6 max-w-xs">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </PageContainer>
  );
}
