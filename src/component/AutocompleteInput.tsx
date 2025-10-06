"use client";
import { useEffect, useRef } from "react";
import TextInput from "./TextInput";

type Props = {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  setLocation: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  error?: string | null;
  showErrors?: boolean;
};

export default function AutocompleteInput({
  label,
  value,
  onChange,
  setLocation,
  placeholder,
  className,
  labelClassName,
  required,
  error,
  showErrors,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ["formatted_address", "geometry", "name", "place_id"],
      componentRestrictions: { country: "au" },
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        onChange(place.formatted_address);
        setLocation(place);
      }
    });
  }, [onChange, setLocation]);

  return (
    <TextInput
      label={label}
      value={value}
      ref={inputRef}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      error={error}
      className={className}
      labelClassName={labelClassName}
      showErrors={showErrors}
    />
  );
}
