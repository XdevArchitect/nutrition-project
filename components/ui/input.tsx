import * as React from "react";
import {cn} from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({className, type, ...props}, ref) => (
  <input ref={ref} type={type} className={cn("flex h-11 w-full rounded-full border border-input bg-transparent px-4 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary", className)} {...props} />
));
Input.displayName = "Input";

export {Input};
