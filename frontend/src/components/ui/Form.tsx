import {
  forwardRef,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { classNames } from "@/utils/helpers";

interface FieldWrap {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & FieldWrap
>(function Input({ label, error, hint, required, className, id, ...rest }, ref) {
  const inputId = id || rest.name;
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-charcoal">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={classNames(
          "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal-muted/60 transition-colors focus:outline-none focus:ring-2",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-charcoal/15 focus:border-primary-500 focus:ring-primary-100",
          className
        )}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="mt-1 text-xs text-charcoal-muted">
          {hint}
        </p>
      )}
    </div>
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & FieldWrap
>(function Textarea({ label, error, hint, required, className, id, ...rest }, ref) {
  const inputId = id || rest.name;
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-charcoal">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        className={classNames(
          "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal-muted/60 transition-colors focus:outline-none focus:ring-2",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-charcoal/15 focus:border-primary-500 focus:ring-primary-100",
          className
        )}
        {...rest}
      />
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
      {!error && hint && <p className="mt-1 text-xs text-charcoal-muted">{hint}</p>}
    </div>
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & FieldWrap
>(function Select({ label, error, hint, required, className, id, children, ...rest }, ref) {
  const inputId = id || rest.name;
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-charcoal">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        className={classNames(
          "w-full appearance-none rounded-xl border bg-white px-4 py-2.5 text-sm text-charcoal transition-colors focus:outline-none focus:ring-2",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-charcoal/15 focus:border-primary-500 focus:ring-primary-100",
          className
        )}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
      {!error && hint && <p className="mt-1 text-xs text-charcoal-muted">{hint}</p>}
    </div>
  );
});