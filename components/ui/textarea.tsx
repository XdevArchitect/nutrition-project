import * as React from "react";
import {cn} from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({className, ...props}, ref) => (
  <textarea ref={ref} className={cn("flex min-h-[140px] w-full rounded-3xl border border-input bg-transparent px-4 py-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary", className)} {...props} />
));
Textarea.displayName = "Textarea";

export {Textarea};
