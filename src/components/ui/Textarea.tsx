import { forwardRef, TextareaHTMLAttributes } from "react";

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`border border-slate-600 bg-slate-900 text-slate-100 placeholder-slate-500 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export default Textarea;
