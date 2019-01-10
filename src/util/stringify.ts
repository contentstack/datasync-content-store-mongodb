export const stringify = (input) => {
  if (typeof input === 'object') {
    if (input.message) {
      return input.message
    }

    return JSON.stringify(input, null, 2)
  }

  return input.toString()
}
