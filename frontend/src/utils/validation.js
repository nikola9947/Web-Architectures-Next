export function validatePassword(password) {
  if (typeof password !== "string") {
    return {
      valid: false,
      message: "Password must be a string."
    }
  }

  if (password.trim().length === 0) {
    return {
      valid: false,
      message: "Password is required."
    }
  }

  if (password.length < 6) {
    return {
      valid: false,
      message: "Password must be at least 6 characters long."
    }
  }

  return {
    valid: true,
    message: "Password is valid."
  }
}