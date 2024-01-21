export function inputValidator(name: string , value: string) {
    if (!value) return `${name} can't be empty.`
    return ''
  }
  