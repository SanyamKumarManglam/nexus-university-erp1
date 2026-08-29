export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validatePassword(password) {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters.' };
  }
  return { valid: true };
}

export function validateRegistration({ firstName, lastName, age, email, phone, password, confirmPassword, role }) {
  const errors = {};

  if (!firstName || firstName.trim().length === 0) {
    errors.firstName = 'First name is required.';
  }
  if (!lastName || lastName.trim().length === 0) {
    errors.lastName = 'Last name is required.';
  }
  if (!age || isNaN(age) || Number(age) < 16 || Number(age) > 100) {
    errors.age = 'Please enter a valid age (16-100).';
  }
  if (!email || !validateEmail(email)) {
    errors.email = 'Please enter a valid university email address.';
  }
  if (!phone || phone.trim().length < 10) {
    errors.phone = 'Please enter a valid 10-digit contact number.';
  }
  
  const passCheck = validatePassword(password);
  if (!passCheck.valid) {
    errors.password = passCheck.message;
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  if (!role || !['admin', 'teacher', 'student'].includes(role)) {
    errors.role = 'Please select a valid user role.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
