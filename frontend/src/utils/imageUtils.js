/**
 * Validates if a URL is valid and complete
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if the URL is valid
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== "string" || url.trim().length === 0) {
    return false;
  }

  // Check if it starts with http:// or https://
  const trimmedUrl = url.trim();
  if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
    return false;
  }

  // Try to parse as URL to ensure it's valid
  try {
    const urlObj = new URL(trimmedUrl);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    // If URL parsing fails, it's not a valid URL
    return false;
  }
};

/**
 * Gets a valid image URL, falling back to placeholder if invalid
 * @param {string} imageUrl - The image URL to validate
 * @param {string} placeholder - The placeholder URL to use if invalid
 * @returns {string} - A valid image URL
 */
export const getImageUrl = (
  imageUrl,
  placeholder = "https://via.placeholder.com/240x360/473b54/ab9cba?text=No+Poster"
) => {
  if (isValidImageUrl(imageUrl)) {
    return imageUrl;
  }
  return placeholder;
};
