export function formatDate(dateString) {
  const date = new Date(dateString); // Convert the string to a Date object
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-US', options); // Or your preferred locale
}