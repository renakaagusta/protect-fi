import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export default function AnimatedGradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative flex max-w-fit flex-row items-center justify-start rounded-2xl leading-tight mb-6 transition-shadow duration-500 ease-out [--bg-size:300%]",
        className,
      )}
    >
      <div
        className={`absolute inset-0 block h-full w-full animate-gradient  ![mask-composite:subtract] [border-radius:0.0rem] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]`}
      />

      {children}
    </div>
  );
}
