export const getRandomBackgroundColor = () => {
  const colors = [
    "007bff", // Blue
    "28a745", // Green
    "dc3545", // Red
    "ffc107", // Yellow
    "17a2b8", // Teal
    "6610f2", // Purple
    "fd7e14", // Orange
    "20c997", // Cyan
    "e83e8c", // Pink
    "6f42c1", // Indigo
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const generateAvatarUrl = (firstname, lastname) => {
  const initials = `${firstname[0]}${lastname[0]}`;
  const backgroundColor = getRandomBackgroundColor();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=${backgroundColor}&color=ffffff`;
};
