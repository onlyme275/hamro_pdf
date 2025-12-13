const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs"); // ✅ Added
const db = require("./database");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        const [existingUser] = await db.execute(
          "SELECT * FROM users WHERE google_id = ?",
          [profile.id]
        );

        if (existingUser.length > 0) {
          return done(null, existingUser[0]);
        }

        // Check if user exists with the same email (from local auth)
        const [emailUser] = await db.execute(
          "SELECT * FROM users WHERE email = ?",
          [profile.emails[0].value]
        );

        if (emailUser.length > 0) {
          await db.execute(
            "UPDATE users SET google_id = ?, auth_provider = 'google', email_verified = 1 WHERE id = ?",
            [profile.id, emailUser[0].id]
          );

          const [updatedUser] = await db.execute(
            "SELECT * FROM users WHERE id = ?",
            [emailUser[0].id]
          );
          return done(null, updatedUser[0]);
        }

        // Create new user
        const userId = uuidv4();
        const userName =
          profile.displayName || profile.emails[0].value.split("@")[0];
        const userImage =
          profile.photos && profile.photos.length > 0
            ? profile.photos[0].value
            : "/default-avatar.png";

        // ✅ Create dummy hashed password to satisfy NOT NULL constraint
        const dummyPassword = await bcrypt.hash("google_oauth_user", 10);

        await db.execute(
          `INSERT INTO users (id, name, email, password, role, image, google_id, auth_provider, email_verified, active, created_at) 
           VALUES (?, ?, ?, ?, 'customer', ?, ?, 'google', 1, 1, NOW())`,
          [userId, userName, profile.emails[0].value, dummyPassword, userImage, profile.id]
        );

        const [newUser] = await db.execute("SELECT * FROM users WHERE id = ?", [
          userId,
        ]);

        return done(null, newUser[0]);
      } catch (error) {
        console.error("Error in Google Strategy:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    done(null, user[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
