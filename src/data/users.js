// src/data/users.js

// This is our database of registered users
// Only these users can login
const registeredUsers = [
  {
    email: "john@gmail.com",
    password: "john123",
    name: "John Doe"
  },
  {
    email: "jane@gmail.com", 
    password: "jane123",
    name: "Jane Smith"
  },
  {
    email: "test@gmail.com",
    password: "test123", 
    name: "Test User"
  },
  {
    email: "admin@dheekart.com",
    password: "admin123",
    name: "Admin"
  }
];

// Get users from localStorage or use defaults
export const getRegisteredUsers = () => {
  const saved = localStorage.getItem('registeredUsers');
  if (saved) {
    return JSON.parse(saved);
  }
  // Initialize localStorage with default users
  localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  return registeredUsers;
};

// Save users to localStorage
export const saveUsers = (users) => {
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};

// Find user by credentials
export const findUser = (email, password) => {
  const users = getRegisteredUsers();
  return users.find(user => user.email === email && user.password === password);
};

// Check if email exists
export const isEmailRegistered = (email) => {
  const users = getRegisteredUsers();
  return users.some(user => user.email === email);
};

// Add new user
export const addUser = (user) => {
  const users = getRegisteredUsers();
  users.push(user);
  saveUsers(users);
  return user;
};