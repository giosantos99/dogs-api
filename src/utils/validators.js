export const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

export const isValidPassword = (password) => {
  return typeof password === "string" && passwordRegex.test(password);
};
