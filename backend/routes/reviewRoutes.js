import express from "express";
import { pool } from "../config/db.js";
import { isAuthenticated } from "../middleware/auth.js";
import { sentiment } from "../server.js"; 

const router = express.Router();

/* -----------------------------------------
   GET REVIEWS FOR A PRODUCT
------------------------------------------*/
router.get("/:id/reviews", async (req, res) => {
    const productId = req.params.id;

    try {
        const [reviews] = await pool.query(
            `
            SELECT 
                r.id, 
                r.review_star, 
                r.review_text, 
                r.created_at, 
                r.sentiment_score,
                u.username AS user_name
            FROM product_reviews r
            LEFT JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
            `,
            [productId]
        );

        res.json(reviews);

    } catch (err) {
        console.error("Review fetch error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/* -----------------------------------------
   ADD PRODUCT REVIEW + SENTIMENT
------------------------------------------*/
router.post("/:id/reviews", isAuthenticated, async (req, res) => {
    const productId = req.params.id;
    const { star, text } = req.body;
    const userId = req.user.id;

    if (!star || star < 1 || star > 5) {
        return res
            .status(400)
            .json({ message: "Star rating must be between 1 and 5" });
    }

    try {
        let sentimentScore = 0;

        if (text && text.trim()) {
            const analysis = sentiment.analyze(text);
            sentimentScore = Math.max(-1, Math.min(1, analysis.comparative));
        }

        await pool.query(
            `
            INSERT INTO product_reviews 
            (product_id, user_id, review_star, review_text, sentiment_score)
            VALUES (?, ?, ?, ?, ?)
            `,
            [productId, userId, star, text, sentimentScore]
        );

        res.status(201).json({
            message: "Review submitted successfully",
            sentiment: sentimentScore,
        });

    } catch (err) {
        console.error("Review insert error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
