"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import {X} from "lucide-react";
import {cn} from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetPortal = SheetPrimitive.Portal;
const SheetClose = SheetPrimitive.Close;
const SheetOverlay = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>>(({className, ...props}, ref) => (
  <SheetPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-all data-[state=closed]:fade-out data-[state=open]:fade-in", className)} {...props} />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>>(({className, children, ...props}, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content ref={ref} className={cn("fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col gap-4 border border-l border-neutral-200 bg-white p-6 shadow-xl transition data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right", className)} {...props}>
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-full p-2 text-neutral-500 hover:text-neutral-700">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({className, ...props}: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />;
const SheetFooter = ({className, ...props}: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("mt-auto flex flex-col gap-2", className)} {...props} />;
const SheetTitle = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Title>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>>(({className, ...props}, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-primary-700", className)} {...props} />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Description>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>>(({className, ...props}, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetClose};
