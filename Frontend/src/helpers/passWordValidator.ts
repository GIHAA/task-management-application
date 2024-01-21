export function passwordValidator(password: string) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

  if (!password) return "Password can't be empty."
  if (!re.test(password)) return 'Ooops! We need a valid password. It must contain at least 8 characters, one lowercase letter, one uppercase letter, and one digit.'
  
  return ''
}
