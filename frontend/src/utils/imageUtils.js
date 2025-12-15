// TMDB Image Configuration
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
const TMDB_POSTER_SIZE = "w500";
const TMDB_BACKDROP_SIZE = "w1280";

/**
 * Builds a complete TMDB image URL from a path
 * @param {string} path - The TMDB image path (e.g., "/abc123.jpg")
 * @param {string} size - The image size (default: w500)
 * @returns {string|null} - Complete image URL or null if path is invalid
 */
export const buildTMDBImageUrl = (path, size = TMDB_POSTER_SIZE) => {
  if (!path || typeof path !== "string") {
    return null;
  }

  const trimmedPath = path.trim();

  // If it's already a complete URL, return it
  if (trimmedPath.startsWith("http://") || trimmedPath.startsWith("https://")) {
    return trimmedPath;
  }

  // If it's a TMDB path (starts with /), build the complete URL
  if (trimmedPath.startsWith("/")) {
    return `${TMDB_IMAGE_BASE_URL}${size}${trimmedPath}`;
  }

  return null;
};

/**
 * Validates if a URL is valid and complete
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if the URL is valid
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== "string" || url.trim().length === 0) {
    return false;
  }

  const trimmedUrl = url.trim();

  // Check if it starts with http:// or https://
  if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
    return false;
  }

  // Try to parse as URL to ensure it's valid
  try {
    const urlObj = new URL(trimmedUrl);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Gets a valid image URL, handling both TMDB paths and complete URLs
 * @param {string} imagePath - The image path or URL
 * @param {string} placeholder - The placeholder URL to use if invalid
 * @param {string} size - The TMDB image size (for TMDB paths)
 * @returns {string} - A valid image URL
 */
export const getImageUrl = (
  imagePath,
  placeholder = "https://via.placeholder.com/240x360/473b54/ab9cba?text=No+Poster",
  size = TMDB_POSTER_SIZE
) => {
  // If it's already a valid complete URL, return it
  if (isValidImageUrl(imagePath)) {
    return imagePath;
  }

  // Try to build TMDB URL if it's a path
  const tmdbUrl = buildTMDBImageUrl(imagePath, size);
  if (tmdbUrl) {
    return tmdbUrl;
  }

  // Fallback to placeholder
  return placeholder;
};

/**
 * Gets a poster image URL (uses w500 size)
 * @param {string} posterPath - The TMDB poster path
 * @param {string} placeholder - The placeholder URL
 * @returns {string} - A valid image URL
 */
export const getPosterUrl = (posterPath, placeholder) => {
  return getImageUrl(posterPath, placeholder, "w500");
};

/**
 * Gets a backdrop image URL (uses w1280 size)
 * @param {string} backdropPath - The TMDB backdrop path
 * @param {string} placeholder - The placeholder URL
 * @returns {string} - A valid image URL
 */
export const getBackdropUrl = (backdropPath, placeholder) => {
  return getImageUrl(backdropPath, placeholder, "w1280");
};
