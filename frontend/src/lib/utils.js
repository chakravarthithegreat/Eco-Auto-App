// Modern CSS utility function
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}