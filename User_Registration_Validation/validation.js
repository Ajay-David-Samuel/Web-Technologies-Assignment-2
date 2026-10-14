/**
 * ============================================================================
 * Laboratory Exercise 03: User Registration Form Validation
 * Technology: HTML5, CSS3, JavaScript (DOM & Regular Expressions)
 * ============================================================================
 */

// DOM Elements
const registrationForm = document.getElementById("regForm");
const successBox = document.getElementById("successBox");
const welcomeGreeting = document.getElementById("welcomeGreeting");
const btnNewRegistration = document.getElementById("btnNewRegistration");

// Input References
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const mobileInput = document.getElementById("mobile");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const dobInput = document.getElementById("dob");
const citySelect = document.getElementById("city");
const termsCheckbox = document.getElementById("terms");

// Error Label References
const fullNameError = document.getElementById("fullNameError");
const emailError = document.getElementById("emailError");
const mobileError = document.getElementById("mobileError");
const genderError = document.getElementById("genderError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const dobError = document.getElementById("dobError");
const cityError = document.getElementById("cityError");
const termsError = document.getElementById("termsError");
const genderGroup = document.getElementById("genderGroup");
const termsBox = document.getElementById("termsBox");

/**
 * Utility: Set error state on a form control
 */
function displayError(inputEl, errorEl, message) {
  errorEl.textContent = message;
  if (inputEl) {
    inputEl.classList.remove("is-valid");
    inputEl.classList.add("is-invalid");
  }
  return false;
}

/**
 * Utility: Set valid state on a form control
 */
function displaySuccess(inputEl, errorEl) {
  errorEl.textContent = "";
  if (inputEl) {
    inputEl.classList.remove("is-invalid");
    inputEl.classList.add("is-valid");
  }
  return true;
}

/**
 * 1. Validate Full Name
 * Rule: Non-empty, minimum 3 characters, alphabets and spaces only
 */
function validateFullName() {
  const value = fullNameInput.value.trim();
  const namePattern = /^[A-Za-z\s]+$/;

  if (value === "") {
    return displayError(fullNameInput, fullNameError, "Full Name is required.");
  }
  if (value.length < 3) {
    return displayError(fullNameInput, fullNameError, "Full Name must contain at least 3 characters.");
  }
  if (!namePattern.test(value)) {
    return displayError(fullNameInput, fullNameError, "Full Name can only contain letters and spaces.");
  }
  return displaySuccess(fullNameInput, fullNameError);
}

/**
 * 2. Validate Email Address
 * Rule: Non-empty, conforms to standard email format using RegEx
 */
function validateEmail() {
  const value = emailInput.value.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (value === "") {
    return displayError(emailInput, emailError, "Email address is required.");
  }
  if (!emailRegex.test(value)) {
    return displayError(emailInput, emailError, "Please enter a valid email address (e.g., user@domain.com).");
  }
  return displaySuccess(emailInput, emailError);
}

/**
 * 3. Validate Mobile Number
 * Rule: Non-empty, digits only, exactly 10 digits
 */
function validateMobileNumber() {
  const value = mobileInput.value.trim();
  const digitsOnly = /^[0-9]+$/;

  if (value === "") {
    return displayError(mobileInput, mobileError, "Mobile number is required.");
  }
  if (!digitsOnly.test(value)) {
    return displayError(mobileInput, mobileError, "Mobile number must only contain digits (0-9).");
  }
  if (value.length !== 10) {
    return displayError(mobileInput, mobileError, "Mobile number must be exactly 10 digits.");
  }
  return displaySuccess(mobileInput, mobileError);
}

/**
 * 4. Validate Gender Selection
 * Rule: One radio option must be selected
 */
function validateGender() {
  const selectedGender = document.querySelector('input[name="gender"]:checked');

  if (!selectedGender) {
    genderError.textContent = "Please select your gender.";
    genderGroup.classList.add("is-invalid");
    return false;
  }
  genderError.textContent = "";
  genderGroup.classList.remove("is-invalid");
  return true;
}

/**
 * 5. Validate Password
 * Rule: Non-empty, min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special character
 */
function validatePassword() {
  const value = passwordInput.value.trim();
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^~_\-+=\(\)\[\]{}|\\:;"'<>,.?/]).{8,}$/;

  if (value === "") {
    return displayError(passwordInput, passwordError, "Password cannot be blank.");
  }
  if (!strongPasswordRegex.test(value)) {
    return displayError(
      passwordInput,
      passwordError,
      "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol."
    );
  }

  // Re-check confirmation if user already entered something in confirm field
  if (confirmPasswordInput.value.trim() !== "") {
    validateConfirmPassword();
  }

  return displaySuccess(passwordInput, passwordError);
}

/**
 * 6. Validate Password Confirmation
 * Rule: Must match the password value exactly
 */
function validateConfirmPassword() {
  const confirmVal = confirmPasswordInput.value.trim();
  const originalVal = passwordInput.value.trim();

  if (confirmVal === "") {
    return displayError(confirmPasswordInput, confirmPasswordError, "Please confirm your password.");
  }
  if (confirmVal !== originalVal) {
    return displayError(confirmPasswordInput, confirmPasswordError, "Passwords do not match.");
  }
  return displaySuccess(confirmPasswordInput, confirmPasswordError);
}

/**
 * 7. Validate Date of Birth
 * Rule: Valid date, not in future, minimum age of 18 years
 */
function validateDateOfBirth() {
  const value = dobInput.value;

  if (value === "") {
    return displayError(dobInput, dobError, "Please select your date of birth.");
  }

  const selectedDate = new Date(value);
  const currentDate = new Date();

  if (isNaN(selectedDate.getTime())) {
    return displayError(dobInput, dobError, "Invalid date format.");
  }

  if (selectedDate > currentDate) {
    return displayError(dobInput, dobError, "Date of birth cannot be in the future.");
  }

  // Calculate age accurately taking months & days into account
  let userAge = currentDate.getFullYear() - selectedDate.getFullYear();
  const monthDifference = currentDate.getMonth() - selectedDate.getMonth();
  const dayDifference = currentDate.getDate() - selectedDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    userAge--;
  }

  if (userAge < 18) {
    return displayError(dobInput, dobError, `You must be at least 18 years old (Current age: ${userAge}).`);
  }

  return displaySuccess(dobInput, dobError);
}

/**
 * 8. Validate City Selection
 * Rule: Must choose a valid option from the dropdown
 */
function validateCity() {
  const value = citySelect.value.trim();

  if (value === "" || value.includes("-- Select")) {
    return displayError(citySelect, cityError, "Please select a city from the list.");
  }
  return displaySuccess(citySelect, cityError);
}

/**
 * 9. Validate Terms and Conditions Checkbox
 * Rule: Checkbox must be checked
 */
function validateTerms() {
  if (!termsCheckbox.checked) {
    termsError.textContent = "You must agree to the Terms & Conditions to proceed.";
    termsBox.classList.add("is-invalid");
    return false;
  }
  termsError.textContent = "";
  termsBox.classList.remove("is-invalid");
  return true;
}

/**
 * Clear all errors, classes, and resets states
 */
function resetValidationState() {
  // Clear error messages
  const errorElements = document.querySelectorAll(".field-error");
  errorElements.forEach((el) => {
    el.textContent = "";
  });

  // Remove valid / invalid classes
  const inputs = document.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.classList.remove("is-valid", "is-invalid");
  });

  genderGroup.classList.remove("is-invalid");
  termsBox.classList.remove("is-invalid");

  // Toggle view visibility
  successBox.style.display = "none";
  registrationForm.style.display = "block";
}

/**
 * Form Submit Event Handler
 */
function handleFormSubmit(e) {
  e.preventDefault();

  // Execute all individual field validations
  const isNameOk = validateFullName();
  const isEmailOk = validateEmail();
  const isMobileOk = validateMobileNumber();
  const isGenderOk = validateGender();
  const isPasswordOk = validatePassword();
  const isConfirmOk = validateConfirmPassword();
  const isDobOk = validateDateOfBirth();
  const isCityOk = validateCity();
  const isTermsOk = validateTerms();

  const isFormValid =
    isNameOk &&
    isEmailOk &&
    isMobileOk &&
    isGenderOk &&
    isPasswordOk &&
    isConfirmOk &&
    isDobOk &&
    isCityOk &&
    isTermsOk;

  if (isFormValid) {
    const registeredName = fullNameInput.value.trim();
    welcomeGreeting.innerHTML = `Welcome aboard, <strong>${registeredName}</strong>!`;

    // Display success container and hide form
    registrationForm.style.display = "none";
    successBox.style.display = "flex";
  }
}

// ----------------------------------------------------------------------------
// Event Listeners Attachment
// ----------------------------------------------------------------------------

// Form Submit & Reset
registrationForm.addEventListener("submit", handleFormSubmit);
registrationForm.addEventListener("reset", () => {
  setTimeout(resetValidationState, 10);
});

// "Register Another User" button inside success card
if (btnNewRegistration) {
  btnNewRegistration.addEventListener("click", () => {
    registrationForm.reset();
    resetValidationState();
  });
}

// Real-time blur validations for text and date inputs
fullNameInput.addEventListener("blur", validateFullName);
emailInput.addEventListener("blur", validateEmail);
mobileInput.addEventListener("blur", validateMobileNumber);
passwordInput.addEventListener("blur", validatePassword);
confirmPasswordInput.addEventListener("blur", validateConfirmPassword);
dobInput.addEventListener("blur", validateDateOfBirth);

// Change events for dropdown, radios, and checkbox
citySelect.addEventListener("change", validateCity);
termsCheckbox.addEventListener("change", validateTerms);

const genderRadios = document.querySelectorAll('input[name="gender"]');
genderRadios.forEach((radio) => {
  radio.addEventListener("change", validateGender);
});

// User-friendly Enter key navigation through fields
const fieldSequence = [
  fullNameInput,
  emailInput,
  mobileInput,
  passwordInput,
  confirmPasswordInput,
  dobInput,
  citySelect
];

registrationForm.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type !== "submit") {
    e.preventDefault();
    const currentIndex = fieldSequence.indexOf(e.target);
    if (currentIndex !== -1 && currentIndex < fieldSequence.length - 1) {
      fieldSequence[currentIndex + 1].focus();
    }
  }
});
