const User = require("../models/userModel");

class UserController {
  // Get all users (Admin only)
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      return res.status(200).json({
        success: true,
        users: users,
        message: "Users retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting all users:", error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving users",
        error: error.message,
      });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      return res.status(200).json({
        success: true,
        user: userWithoutPassword,
        message: "User retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving user",
        error: error.message,
      });
    }
  }

  // @desc    Get current logged in user
  // @route   GET /api/auth/me
  // @access  Private
  static async getMe(req, res) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          phone: user.phone,
          address: user.address,
          authProvider: user.auth_provider,
          emailVerified: user.email_verified,
        },
      });
    } catch (error) {
      console.error("Error getting user: ", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Register new user
  static async register(req, res) {
    try {
      const { name, email, password, role = "user", phone, address } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and password are required",
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Create new user
      const newUser = new User(
        name,
        email,
        password,
        role,
        null, // image
        phone,
        address
      );

      await newUser.save();

      // Generate token
      const token = User.getAuthToken(newUser.id);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        success: true,
        data: {
          user: userWithoutPassword,
          token: token,
        },
        message: "User registered successfully",
      });
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).json({
        success: false,
        message: "Error registering user",
        error: error.message,
      });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Check if user registered with OAuth
      if (user.auth_provider !== "local" && !user.password) {
        return res.status(400).json({
          success: false,
          message: `This account is registered with ${user.auth_provider}. Please use ${user.auth_provider} to login.`,
        });
      }

      // Check if user is active
      if (user.active === 0) {
        return res.status(403).json({
          success: false,
          message: "Your account has been deactivated. Please contact support.",
        });
      }

      // Validate password
      const isValidPassword = await User.validatePassword(
        password,
        user.password
      );
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate token
      const token = User.getAuthToken(user.id);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        success: true,
        data: {
          user: userWithoutPassword,
          token: token,
        },
        message: "Login successful",
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({
        success: false,
        message: "Error during login",
        error: error.message,
      });
    }
  }

  // @desc    Handle Google OAuth callback
  // @route   GET /api/auth/google/callback (handled by passport, then this)
  // @access  Public
  static async googleCallback(req, res) {
    try {
      // Check if user is active
      if (req.user.active !== 1) {
        return res.redirect(
          process.env.FRONTEND + "/login?error=account_deactivated"
        );
      }

      // Generate token
      const token = User.getAuthToken(req.user.id);

      // Prepare user data (exclude sensitive fields)
      const userData = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        image: req.user.image,
      };

      // Encode user data for URL
      const encodedUser = encodeURIComponent(JSON.stringify(userData));

      // Redirect with both token and user data
      res.redirect(
        `${process.env.FRONTEND}/oauth/callback?token=${token}&user=${encodedUser}`
      );
    } catch (error) {
      console.error("Error in Google callback:", error);
      res.redirect(process.env.FRONTEND + "/login?error=auth_failed");
    }
  }

  // Add user (Admin only)
  static async addUser(req, res) {
    try {
      const { name, email, password, role = "user", phone, address } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and password are required",
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Create new user
      const newUser = new User(
        name,
        email,
        password,
        role,
        null, // image
        phone,
        address,
        1 // active by default
      );

      await newUser.save();

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        success: true,
        data: {
          user: userWithoutPassword,
        },
        message: "User added successfully",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      return res.status(500).json({
        success: false,
        message: "Error adding user",
        error: error.message,
      });
    }
  }

  // Update user
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.password;
      delete updateData.created_at;

      // If email is being updated, check if it's already in use
      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await User.findByEmail(updateData.email);
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: "Email is already in use",
          });
        }
      }

      // Update user
      await User.updateUser(id, updateData);

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({
        success: false,
        message: "Error updating user",
        error: error.message,
      });
    }
  }

  // Delete user (Hard delete - Admin only)
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prevent self-deletion
      if (req.user && req.user.id === id) {
        return res.status(400).json({
          success: false,
          message: "You cannot delete your own account",
        });
      }

      // Delete user
      await User.deleteUser(id);

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({
        success: false,
        message: "Error deleting user",
        error: error.message,
      });
    }
  }

  // Soft delete user (Deactivate - Admin only)
  static async deactivateUser(req, res) {
    try {
      const { id } = req.params;

      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prevent self-deactivation
      if (req.user && req.user.id === id) {
        return res.status(400).json({
          success: false,
          message: "You cannot deactivate your own account",
        });
      }

      // Deactivate user
      await User.softDeleteUser(id);

      return res.status(200).json({
        success: true,
        message: "User deactivated successfully",
      });
    } catch (error) {
      console.error("Error deactivating user:", error);
      return res.status(500).json({
        success: false,
        message: "Error deactivating user",
        error: error.message,
      });
    }
  }

  // Change password (User can change their own password)
  static async changePassword(req, res) {
    try {
      const { id, oldPassword, newPassword } = req.body;

      // Validate required fields
      if (!id || !oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "User ID, old password, and new password are required",
        });
      }

      // Find user
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Validate old password
      const isValidPassword = await User.validatePassword(
        oldPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Update password
      await User.resetPassword(id, newPassword);

      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({
        success: false,
        message: "Error changing password",
        error: error.message,
      });
    }
  }

  // Reset password (Admin only - doesn't require old password)
  static async resetPassword(req, res) {
    try {
      const { id, newPassword } = req.body;

      // Validate required fields
      if (!id || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "User ID and new password are required",
        });
      }

      // Find user
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update password
      await User.resetPassword(id, newPassword);

      return res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      return res.status(500).json({
        success: false,
        message: "Error resetting password",
        error: error.message,
      });
    }
  }

  // Update user image
  static async updateImage(req, res) {
    try {
      const { id } = req.params;
      const imagePath = req.file ? req.file.path : null;

      if (!imagePath) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }

      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update image
      await User.updateImage(id, imagePath);

      return res.status(200).json({
        success: true,
        message: "Image updated successfully",
        imagePath: imagePath,
      });
    } catch (error) {
      console.error("Error updating image:", error);
      return res.status(500).json({
        success: false,
        message: "Error updating image",
        error: error.message,
      });
    }
  }
}

module.exports = UserController;
