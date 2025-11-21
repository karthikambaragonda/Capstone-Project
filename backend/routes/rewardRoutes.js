import express from "express";
import { pool } from "../config/db.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

/* ------------------------------------------------
   GET TOTAL REWARD POINTS
------------------------------------------------ */
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const [[reward]] = await pool.query(
            "SELECT points FROM user_rewards WHERE user_id = ?",
            [req.user.id]
        );

        res.json({ points: reward?.points || 0 });

    } catch (err) {
        console.error("Rewards Fetch Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/* ------------------------------------------------
   REWARD TRANSACTION HISTORY
------------------------------------------------ */
router.get("/history", isAuthenticated, async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM reward_transactions WHERE user_id = ? ORDER BY created_at DESC",
            [req.user.id]
        );

        res.json(rows);

    } catch (err) {
        console.error("Reward History Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/* ------------------------------------------------
   EARN POINTS
------------------------------------------------ */
router.post("/earn", isAuthenticated, async (req, res) => {
    const { points, description } = req.body;

    try {
        await pool.query(
            `
            INSERT INTO user_rewards (user_id, points)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE points = points + VALUES(points)
            `,
            [req.user.id, points]
        );

        await pool.query(
            `
            INSERT INTO reward_transactions (user_id, points, type, description)
            VALUES (?, ?, 'earn', ?)
            `,
            [req.user.id, points, description || "Points earned"]
        );

        res.json({ message: "Points added successfully!" });

    } catch (err) {
        console.error("Earn Points Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/* ------------------------------------------------
   REDEEM POINTS
------------------------------------------------ */
router.post("/redeem", isAuthenticated, async (req, res) => {
    const { points, description } = req.body;

    try {
        const [[reward]] = await pool.query(
            "SELECT points FROM user_rewards WHERE user_id = ?",
            [req.user.id]
        );

        if (!reward || reward.points < points) {
            return res.status(400).json({ message: "Not enough points" });
        }

        await pool.query(
            "UPDATE user_rewards SET points = points - ? WHERE user_id = ?",
            [points, req.user.id]
        );

        await pool.query(
            `
            INSERT INTO reward_transactions (user_id, points, type, description)
            VALUES (?, ?, 'redeem', ?)
            `,
            [req.user.id, -points, description || "Redeemed points"]
        );

        res.json({ message: "Points redeemed!" });

    } catch (err) {
        console.error("Redeem Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/* ------------------------------------------------
   SPIN THE WHEEL (Daily Spin)
------------------------------------------------ */
router.post("/spin", isAuthenticated, async (req, res) => {
    try {
        const [[lastSpin]] = await pool.query(
            `
            SELECT created_at 
            FROM spin_rewards 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 1
            `,
            [req.user.id]
        );

        // DAILY LIMIT
        if (
            lastSpin &&
            new Date(lastSpin.created_at).toDateString() === new Date().toDateString()
        ) {
            return res.status(400).json({ message: "You already used your daily spin!" });
        }

        // Reward Pool
        const rewards = [
            { type: "points", value: 10 },
            { type: "points", value: 20 },
            { type: "points", value: 50 },
            { type: "none", value: 0 } // Better luck next time
        ];

        const reward = rewards[Math.floor(Math.random() * rewards.length)];

        await pool.query(
            `
            INSERT INTO spin_rewards (user_id, reward_type, reward_value)
            VALUES (?, ?, ?)
            `,
            [req.user.id, reward.type, reward.value]
        );

        if (reward.type === "points") {
            await pool.query(
                `
                INSERT INTO user_rewards (user_id, points)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE points = points + VALUES(points)
                `,
                [req.user.id, reward.value]
            );

            await pool.query(
                `
                INSERT INTO reward_transactions (user_id, points, type, description)
                VALUES (?, ?, 'bonus', 'Spin-the-Wheel reward')
                `,
                [req.user.id, reward.value]
            );
        }

        res.json({ reward });

    } catch (err) {
        console.error("Spin Error:", err);
        res.status(500).json({ message: "Something went wrong, please try again later." });
    }
});

export default router;
