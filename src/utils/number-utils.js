function convertToNumber(numberAsText) {
  try {
    if (numberAsText) {
      const cleanedString = numberAsText
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .replace('R$', '')
        .trim()
      return parseFloat(cleanedString)
    }
  } catch (error) {
    console.log('Error while converting number', error)
  }
  return null
}

export default convertToNumber
