const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function validatePhotoFile(file: File) {
  if (!file.type.startsWith("image/")) {
    return "This photo format is not supported yet. Try a clear dog photo in JPG, PNG, or WEBP.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "This photo is a little too large right now. Try one under 5MB.";
  }

  return null;
}
