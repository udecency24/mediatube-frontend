/**
 * Validates user input for forms
 */

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with status and message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }

  return { isValid: true };
};

/**
 * Validates username
 * @param {string} username - Username to validate
 * @returns {object} - Validation result with status and message
 */
export const validateUsername = (username) => {
  if (!username || username.trim().length < 3) {
    return {
      isValid: false,
      message: "Username must be at least 3 characters long",
    };
  }

  if (username.length > 30) {
    return {
      isValid: false,
      message: "Username must not exceed 30 characters",
    };
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      message: "Username can only contain letters, numbers, and underscores",
    };
  }

  return { isValid: true };
};

/**
 * Validates video upload form fields
 * @param {object} formData - Form data to validate
 * @returns {object} - Validation result with errors for each field
 */
export const validateVideoForm = (formData) => {
  const errors = {};

  if (!formData.title || formData.title.trim() === "") {
    errors.title = "Title is required";
  } else if (formData.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }

  if (!formData.publisher || formData.publisher.trim() === "") {
    errors.publisher = "Publisher is required";
  }

  if (!formData.producer || formData.producer.trim() === "") {
    errors.producer = "Producer is required";
  }

  if (!formData.genre) {
    errors.genre = "Please select a genre";
  }

  if (!formData.ageRating) {
    errors.ageRating = "Please select an age rating";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
