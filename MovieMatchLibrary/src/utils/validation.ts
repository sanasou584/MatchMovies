export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const hasUppercase = (str: string): boolean => /[A-Z]/.test(str);
const hasNumber = (str: string): boolean => /[0-9]/.test(str);
const hasSymbol = (str: string): boolean => /[^A-Za-z0-9]/.test(str);

export const isValidPassword = (pswd: string): boolean => {
  return (
    pswd.length >= 8 &&
    hasUppercase(pswd) &&
    hasNumber(pswd) &&
    hasSymbol(pswd)
  );
};

export const isValidName = (name: string): boolean => {
  return /^[A-Za-zÀ-ÿ\s'-]+$/.test(name) && name.trim().length >= 2;
};

export const isValidDOB = (dob: string): boolean => {
  if (!dob) return false;

  const date = new Date(dob);
  const today = new Date();

  return !isNaN(date.getTime()) && date <= today;
};
