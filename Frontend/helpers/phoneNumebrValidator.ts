import { phone } from "phone"

export function phoneNumebrValidator(
  value: string,
  country: { countryCode: string },
) {
  const res = phone("+" + value, { country: country.countryCode })

  if (!res.isValid) {
    return "Invalid phone number."
  }
  return ""
}