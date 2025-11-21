import express from "express";
import { pool } from "../config/db.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

/* -----------------------------------------
   CREATE PRICE ALERT
------------------------------------------*/
router.post("/", isAuthenticated, async (req, res) => {
    const { product_id, target_price } = req.body;
    const user_id = req.user.id;

    if (!product_id || !target_price) {
        return res.status(400).json({
            message: "Product ID and target price are required",
        });
    }

    try {
        const [[existing]] = await pool.query(
            "SELECT * FROM price_alerts WHERE user_id = ? AND product_id = ?",
            [user_id, product_id]
        );

        if (existing) {
            return res.status(400).json({
                message: "Price alert already exists for this product",
            });
        }

        await pool.query(
            "INSERT INTO price_alerts (user_id, product_id, target_price) VALUES (?, ?, ?)",
            [user_id, product_id, target_price]
        );

        res.status(201).json({ message: "Price alert set successfully" });

    } catch (err) {
        console.error("Create Price Alert Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/* -----------------------------------------
   GET USER PRICE ALERTS
------------------------------------------*/
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;

        const [alerts] = await pool.query(
            `
            SELECT 
                pa.id, 
                pa.product_id, 
                pa.target_price, 
                pa.notified, 
                pa.created_at,
                p.name, 
                p.price AS current_price, 
                p.image_url
            FROM price_alerts pa
            JOIN products p ON pa.product_id = p.id
            WHERE pa.user_id = ?
            `,
            [userId]
        );

        res.json(alerts);

    } catch (err) {
        console.error("Fetch Alerts Error:", err);
        res.status(500).json({ message: "Failed to fetch price alerts" });
    }
});

/* -----------------------------------------
   UPDATE PRICE ALERT
------------------------------------------*/
router.put("/:id", isAuthenticated, async (req, res) => {
    const alertId = req.params.id;
    const { target_price } = req.body;

    if (!target_price) {
        return res.status(400).json({
            message: "Target price is required",
        });
    }

    try {
        const [result] = await pool.query(
            "UPDATE price_alerts SET target_price = ? WHERE id = ?",
            [target_price, alertId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Price alert not found" });
        }

        const [rows] = await pool.query(
            "SELECT * FROM price_alerts WHERE id = ?",
            [alertId]
        );

        res.json(rows[0]);

    } catch (err) {
        console.error("Update Price Alert Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/* -----------------------------------------
   DELETE PRICE ALERT
------------------------------------------*/
router.delete("/:id", isAuthenticated, async (req, res) => {
    const alertId = req.params.id;

    try {
        const [result] = await pool.query(
            "DELETE FROM price_alerts WHERE id = ?",
            [alertId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Price alert not found" });
        }

        res.json({ message: "Price alert deleted successfully" });

    } catch (err) {
        console.error("Delete Alert Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
