import { describe, it, expect } from "vitest"
import { validatePassword } from "./validation"

describe("validatePassword", () => {

  it("accepts a valid password", () => {
    expect(validatePassword("12345678")).toEqual({
      valid: true,
      message: "Password is valid."
    })
  })

  it("rejects an empty password", () => {
    expect(validatePassword("")).toEqual({
      valid: false,
      message: "Password is required."
    })
  })

  it("rejects a password that is too short", () => {
    expect(validatePassword("123")).toEqual({
      valid: false,
      message: "Password must be at least 6 characters long."
    })
  })

  /* HIER REIN */
  it("accepts a password with exactly 6 characters", () => {
    expect(validatePassword("123456")).toEqual({
      valid: true,
      message: "Password is valid."
    })
  })

})