import User from '../models/users.js';

class UserManager {
  async createUser(user) {
    try {
      const newUser = await User.create(user);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async updateUser(userId, updatedData) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      return deletedUser;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export default UserManager;
