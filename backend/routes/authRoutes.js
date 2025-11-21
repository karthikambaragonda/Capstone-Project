import express from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import { pool } from "../config/db.js";
import nodemailer from "nodemailer";

const router = express.Router();

/* -----------------------------------------
   REGISTER USER
------------------------------------------*/
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, role = "customer" } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
            [username, email, hashedPassword, role]
        );

        // Email Transport
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"ShopNest Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `🎉 Welcome to ShopNest, ${username}!`,
            html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial; background:#f2f2f7; padding:32px;">
  <div style="
      max-width:520px;
      margin:auto;
      background:#ffffff;
      border-radius:28px;
      overflow:hidden;
      box-shadow:0 16px 40px rgba(0,0,0,0.12);
  ">
    <div style="padding:32px 24px; text-align:center; background:#ffffff;">
      <img src="https://raw.githubusercontent.com/shopnestwebapp-maker/Capstone-Project/refs/heads/main/backend/image.png"
           width="38" style="opacity:0.85; margin-bottom:14px;" />
      <h1 style="margin:0; font-weight:600; font-size:22px; letter-spacing:-0.2px; color:#111111;">
        Welcome to ShopNest 🎉
      </h1>
      <p style="color:#6e6e73; font-size:14px; margin-top:6px;">
        Your account has been successfully created
      </p>
    </div>

    <!-- Divider -->
    <div style="height:1px; background:#e5e5ea;"></div>

    <!-- Body -->
    <div style="padding:28px 26px; color:#1d1d1f;">

      <h2 style="margin:0 0 12px; font-size:20px; font-weight:600; letter-spacing:-0.2px;">
        Hello, ${username} 👋
      </h2>

      <p style="font-size:16px; color:#515154; line-height:1.5; margin-bottom:24px;">
        Thank you for joining <b>ShopNest</b>. You can now explore amazing deals and personalized shopping features.
      </p>

      <!-- Apple-style information card -->
      <div style="
          background:#f5f5f7; 
          border-radius:22px; 
          padding:18px 22px; 
          border:1px solid #e5e5ea;
          margin-bottom:28px;
      ">
        <p style="margin:6px 0; font-size:15px; color:#1d1d1f;">
          📧 <b>Email:</b> ${email}
        </p>
        <p style="margin:6px 0; font-size:15px; color:#1d1d1f;">
          🔑 <b>Password:</b> ${password}
        </p>
      </div>

      <p style="font-size:15px; color:#6e6e73; margin-bottom:28px;">
        You're all set! Log in and start your shopping journey with us.
      </p>

      <!-- Apple-style button -->
      <div style="text-align:center;">
        <a href="https://shopnest-webapp.vercel.app/"
          style="
            background:#0071e3; 
            color:#ffffff; 
            padding:12px 26px; 
            text-decoration:none; 
            font-size:16px; 
            font-weight:600;
            border-radius:12px; 
            display:inline-block;
            box-shadow:0 4px 14px rgba(0,113,227,0.35);
          ">
          🔑 Login Now
        </a>
      </div>

    </div>

    <!-- Divider -->
    <div style="height:1px; background:#e5e5ea;"></div>

    <!-- Footer -->
    <div style="padding:20px 26px; text-align:center; color:#8e8e93; font-size:12px;">
      Need help? 
      <a href="https://shopnest-webapp.vercel.app/" style="color:#0071e3; text-decoration:none;">
        Contact Support
      </a>
      <br><br>
      © ${new Date().getFullYear()} ShopNest. All rights reserved.
    </div>

  </div>
</div>
`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: "User registered successfully & welcome email sent",
        });

    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                message: "Username or email already exists",
            });
        }
        console.error("Register error:", err);
        res.status(500).json({
            message: "Error registering user",
        });
    }
});

/* -----------------------------------------
   LOGIN USER
------------------------------------------*/
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error("Auth error:", err);
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: info?.message || "Invalid credentials",
            });
        }

        req.login(user, (err) => {
            if (err) {
                console.error("Login error:", err);
                return next(err);
            }
            const safeUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            };
            return res.json({
                success: true,
                message: "Logged in successfully",
                user: safeUser,
            });
        });
    })(req, res, next);
});

/* -----------------------------------------
   LOGOUT USER
------------------------------------------*/
router.post("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            console.error("Logout error:", err);
            return next(err);
        }

        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    console.error("Session destroy error:", err);
                    res.clearCookie("connect.sid");
                    return res.status(200).json({
                        success: true,
                        message: "Logged out (session destroy failed)",
                    });
                }
                res.clearCookie("connect.sid");
                return res.json({
                    success: true,
                    message: "Logged out successfully",
                });
            });
        } else {
            res.clearCookie("connect.sid");
            return res.json({
                success: true,
                message: "Logged out successfully",
            });
        }
    });
});
router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role
            }
        });
    } else {
        res.json({ user: null });
    }
});

export default router;
