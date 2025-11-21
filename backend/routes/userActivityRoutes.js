import express from "express";
import { pool } from "../config/db.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

/* -----------------------------------------
   TRACK PRODUCT VIEW
------------------------------------------*/
router.post("/track-view", isAuthenticated, async (req, res) => {
    const { product_id } = req.body;

    if (!product_id) {
        return res.status(400).json({ message: "Product ID required" });
    }

    try {
        await pool.query(
            "INSERT INTO user_activity (user_id, product_id, action) VALUES (?, ?, 'view')",
            [req.user.id, product_id]
        );

        res.json({ success: true });

    } catch (err) {
        console.error("Error tracking view:", err);
        res.status(500).json({ message: "Error tracking view" });
    }
});

/* -----------------------------------------
   TRACK ADD TO CART
------------------------------------------*/
router.post("/track-cart", isAuthenticated, async (req, res) => {
    const { product_id } = req.body;

    if (!product_id) {
        return res.status(400).json({ message: "Product ID required" });
    }

    try {
        await pool.query(
            "INSERT INTO user_activity (user_id, product_id, action) VALUES (?, ?, 'add_to_cart')",
            [req.user.id, product_id]
        );

        res.json({ success: true });

    } catch (err) {
        console.error("Error tracking view:", err);
        res.status(500).json({ message: "Error tracking view" });
    }
});

/* -----------------------------------------
   RECENTLY VIEWED PRODUCTS
------------------------------------------*/
router.get("/history", isAuthenticated, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `
            SELECT 
                p.id, 
                p.name, 
                p.price, 
                p.image_url, 
                c.name AS category_name, 
                MAX(ua.created_at) AS last_viewed
            FROM user_activity ua
            JOIN products p ON ua.product_id = p.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE ua.user_id = ? 
              AND ua.action = 'view'
            GROUP BY p.id
            ORDER BY last_viewed DESC
            LIMIT 10
        `,
            [req.user.id]
        );

        res.json(rows);

    } catch (err) {
        console.error("Error fetching history:", err);
        res.status(500).json({ message: "Error fetching history" });
    }
});

export default router;
