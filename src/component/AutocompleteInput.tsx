"use client";
import { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  setLocation: (val: string) => void;
  placeholder?: string;
  className?: string;
};

export default function AutocompleteInput({ value, onChange, setLocation, placeholder, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
      fields: ["formatted_address", "geometry", "name"],
      componentRestrictions: { country: "au" }, // optional: limit to Australia
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        onChange(place.formatted_address);
        setLocation(place.formatted_address);
      }
    });
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}