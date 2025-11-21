import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { pool } from "./db.js";

export function configurePassport() {
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const [users] = await pool.query(
                    "SELECT * FROM users WHERE email = ?",
                    [username]
                );

                if (users.length === 0) return done(null, false, { message: "Incorrect username." });

                const user = users[0];
                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) return done(null, false, { message: "Incorrect password." });

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
            if (users.length === 0) return done(null, false);
            done(null, users[0]);
        } catch (err) {
            done(err);
        }
    });

    return passport;
}
