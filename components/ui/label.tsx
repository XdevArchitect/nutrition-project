import * as React from "react";
import {Slot} from "@radix-ui/react-slot";
import {cn} from "@/lib/utils";

export interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

const Label = React.forwardRef<HTMLSpanElement, LabelProps>(({className, asChild, ...props}, ref) => {
  const Comp = asChild ? Slot : "span";
  return <Comp ref={ref} className={cn("text-sm font-medium text-neutral-600", className)} {...props} />;
});
Label.displayName = "Label";

export {Label};
