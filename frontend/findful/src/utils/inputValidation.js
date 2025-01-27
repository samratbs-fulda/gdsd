// Regex for allowed characters
export const allowedCharactersRegex = /^[a-zA-Z0-9\s-.$!,"@]*$/;

// Utility function to generate validation rule for text fields
export const getSpecialCharacterValidationRule = (fieldName = "this field") => ({
  pattern: allowedCharactersRegex,
  message: `Special characters are not allowed in ${fieldName}.`,
});