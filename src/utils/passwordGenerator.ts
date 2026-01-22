/**
 * Generates a secure random password
 * @param length - Length of password to generate (default: 16)
 * @param includeSymbols - Include special symbols (default: true)
 * @returns Generated password string
 */
export function generatePassword(length: number = 16, includeSymbols: boolean = true): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+';
  
  let chars = lowercase + uppercase + numbers;
  if (includeSymbols) {
    chars += symbols;
  }
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password;
}
