export default (
  email: string | undefined,
  setEmailError: (message: string) => void,
  setLoading: (loading: boolean) => void
): boolean => {
  const isValid =
    email && /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);

  if (!isValid) {
    setEmailError("Please enter a valid email address.");
    setLoading(false);
    return false;
  } else {
    setEmailError("");
    return true;
  }
};
