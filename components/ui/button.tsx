import * as React from "react";
import {Slot} from "@radix-ui/react-slot";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft-xl hover:bg-primary/90",
        secondary: "border border-input bg-background text-primary hover:bg-primary/5",
        ghost: "text-primary hover:bg-primary/10",
        outline: "border border-primary/40 text-primary hover:bg-primary/5",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "px-5 py-3",
        sm: "px-4 py-2 text-xs",
        lg: "px-6 py-4 text-base",
        icon: "h-10 w-10 rounded-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({className, variant, size, asChild = false, ...props}, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({variant, size}), className)} ref={ref} {...props} />;
});

Button.displayName = "Button";

export {Button, buttonVariants};
