import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  padBottom?: boolean;
}

export function PageContainer({ children, className, padBottom = true }: PageContainerProps) {
  return (
    <main
      className={cn(
        "max-w-lg mx-auto w-full px-5",
        padBottom && "pb-24",
        className
      )}
    >
      {children}
    </main>
  );
}
