import { storageService } from './storageService';
import { validateRegistration } from '../utils/validation';

export const authService = {
  login: async (email, password, role) => {
    // Artificial slight network latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 300));

    const users = storageService.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if user exists with matching email & password & role
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail &&
        u.password === password &&
        (!role || u.role.toLowerCase() === role.toLowerCase())
    );

    if (!user) {
      throw new Error('Invalid credentials or role mismatch. Please check your email, password, and selected role.');
    }

    // Sanitize user before returning session (do not return password)
    const { password: _, ...safeUser } = user;
    storageService.saveSessionUser(safeUser);
    return safeUser;
  },

  register: async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const validation = validateRegistration(userData);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError);
    }

    const users = storageService.getUsers();
    const cleanEmail = userData.email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `U-${Date.now()}`,
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      name: `${userData.firstName.trim()} ${userData.lastName.trim()}`,
      email: cleanEmail,
      password: userData.password,
      role: userData.role,
      age: Number(userData.age),
      phone: userData.phone.trim(),
      department: userData.department || 'General',
      designation: userData.role === 'admin' ? 'University Administrator' : userData.role === 'teacher' ? 'Faculty Member' : 'Undergraduate Student',
      avatar: (userData.firstName[0] + (userData.lastName[0] || '')).toUpperCase()
    };

    users.push(newUser);
    storageService.saveUsers(users);

    const { password: _, ...safeUser } = newUser;
    storageService.saveSessionUser(safeUser);
    return safeUser;
  },

  logout: async () => {
    storageService.saveSessionUser(null);
  },

  getCurrentUser: () => {
    return storageService.getSessionUser();
  },

  updateProfile: async (updatedFields) => {
    const session = storageService.getSessionUser();
    if (!session) throw new Error('No active session.');

    const users = storageService.getUsers();
    const index = users.findIndex((u) => u.id === session.id);
    if (index === -1) throw new Error('User not found.');

    const updated = {
      ...users[index],
      ...updatedFields,
      name: updatedFields.firstName && updatedFields.lastName
        ? `${updatedFields.firstName} ${updatedFields.lastName}`
        : users[index].name
    };

    users[index] = updated;
    storageService.saveUsers(users);

    const { password: _, ...safeUser } = updated;
    storageService.saveSessionUser(safeUser);
    return safeUser;
  }
};
