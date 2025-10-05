// ---------- Utility: Combine multiple validators ---------- //
export const combineValidators =
  (...validators: ((val: string) => string | null)[]) =>
  (val: string): string | null => {
    for (const v of validators) {
      const error = v(val);
      if (error) return error;
    }
    return null;
  };

// ---------- Base Validators ---------- //

// Required field validator
export const validateRequired =
  (label: string = "This field") =>
  (val: string): string | null => {
    return val.trim() ? null : `${label} is required`;
  };

// Min length validator
export const minLength =
  (n: number, label: string = "Field") =>
  (val: string): string | null => {
    return val.length >= n ? null : `${label} must be at least ${n} characters`;
  };

// Max length validator
export const maxLength =
  (n: number, label: string = "Field") =>
  (val: string): string | null => {
    return val.length <= n ? null : `${label} must be at most ${n} characters`;
  };

// Regex-based validator factory
export const matchesRegex =
  (regex: RegExp, errorMsg: string) =>
  (val: string): string | null =>
    regex.test(val) ? null : errorMsg;

// ---------- Combined Common Validators ---------- //

// Email validator
export const validateEmail = combineValidators(
  validateRequired("Email"),
  matchesRegex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
);

// Password validator
export const validatePassword = combineValidators(
  validateRequired("Password"),
  minLength(6, "Password")
);

// Username validator
export const validateUsername = combineValidators(
  validateRequired("Username"),
  minLength(3, "Username"),
  matchesRegex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
);

// Numbers-only validator (generic)
export const validateNumbersOnly = combineValidators(
  validateRequired("This field"),
  matchesRegex(/^[0-9]+$/, "Only numbers are allowed")
);

// Phone number validator (numbers-only, length 8–15)
export const validatePhoneNumber = combineValidators(
  validateRequired("Phone number"),
  matchesRegex(/^[0-9]+$/, "Invalid phone number (digits only)"),
  minLength(8, "Phone number"),
  maxLength(15, "Phone number")
);

// Letters-only validator (allow spaces)
export const validateLettersOnly = combineValidators(
  validateRequired("This field"),
  matchesRegex(/^[A-Za-z\s]+$/, "Only letters are allowed")
);
