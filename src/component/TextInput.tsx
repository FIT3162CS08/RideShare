"use client";
import { forwardRef, useEffect, useState } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string | null;
  placeholder?: string;
  required?: boolean;
//   validate?: (val: string) => string | null; // custom validator returns error message
  type?: string;
  className?: string;
  labelClassName?: string;
  showErrors?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

export default forwardRef<HTMLInputElement, Props>(function TextInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  type = "text",
  className,
  labelClassName,
  showErrors = false,
  ...inputProps
}: Props, ref?: React.Ref<HTMLInputElement>) {
  const [touched, setTouched] = useState(false);
  console.log("TEST", touched, showErrors)

//   setTouched(showErrors);
  const shouldShowError = showErrors && !touched && !!error;

  useEffect(() => {
    setTouched(!showErrors);
  }, [error]);

  return (
    <div>
      <label className={labelClassName || "text-sm font-medium"}>{label}</label>
      <input
        {...inputProps}
        type={type}
        value={value}
        ref={ref}
        placeholder={placeholder}
        onChange={(e) => {
            onChange(e.target.value)
            if (!touched) setTouched(true)
        }}
        className={`${className} ${
          shouldShowError ? "border-red-500" : "border-slate-300"
        }`}
      />
      {shouldShowError && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});
