export const isValidImageFile = (file: File): boolean => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  return allowedTypes.includes(file.type);
};
