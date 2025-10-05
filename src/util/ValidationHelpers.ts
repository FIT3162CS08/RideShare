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
  matchesRegex(/^[0-9]+$/, "Invalid phone number (digits only, no spaces or symbols)"),
  minLength(8, "Phone number"),
  maxLength(15, "Phone number")
);

// Letters-only validator (allow spaces)
export const validateLettersOnly = combineValidators(
  validateRequired("This field"),
  matchesRegex(/^[A-Za-z\s]+$/, "Only letters are allowed")
);

// Date validator (must be today or within 7 days)
export const validateDate = combineValidators(
  validateRequired("Date"),
  (val: string): string | null => {
    const inputDate = new Date(val);
    const today = new Date();
    const maxDate = new Date();

    // normalize time to midnight for comparison
    today.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);
    maxDate.setDate(today.getDate() + 7);

    if (isNaN(inputDate.getTime())) {
      return "Invalid date format";
    }
    if (inputDate < today) {
      return "Date cannot be in the past";
    }
    if (inputDate > maxDate) {
      return "Bookings can only be made up to 7 days in advance";
    }

    return null;
  }
);

export function validateBirthday(dateString: string): string | null {
  if (!dateString) return "Birthday is required";

  const inputDate = new Date(dateString);
  const today = new Date();

  if (isNaN(inputDate.getTime())) return "Invalid date format";

  // Must be before today (no future birthdays)
  if (inputDate >= today) return "Birthday must be before today";

  // Must not be older than 130 years
  const oldestAllowed = new Date();
  oldestAllowed.setFullYear(today.getFullYear() - 130);

  if (inputDate < oldestAllowed)
    return "Birthday must be within the last 130 years";

  return null;
}


// Time validator (must be later than current time today)
export const validateTime = (val: string): string | null => {
  console.log("Test")
  console.log(val)
  const [hours, minutes] = val.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return "Invalid time format";

  console.log(hours, minutes)
  const now = new Date();
  const inputTime = new Date();
  inputTime.setHours(hours, minutes, 0, 0);
  console.log(inputTime, now, (inputTime < now))


  if (inputTime < now) return "Time cannot be in the past";
  return null;
};