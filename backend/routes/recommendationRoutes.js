import express from "express";
import { pool } from "../config/db.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// router.get("/", isAuthenticated, async (req, res) => {
//     try {
//         const [cats] = await pool.query(`
//             SELECT p.category_id, COUNT(*) AS views
//             FROM user_activity ua
//             JOIN products p ON ua.product_id = p.id
//             WHERE ua.user_id = ? AND ua.action = 'view'
//             GROUP BY p.category_id
//             ORDER BY views DESC
//             LIMIT 3
//         `, [req.user.id]);

//         if (cats.length === 0) {
//             const [recent] = await pool.query(
//                 "SELECT * FROM products ORDER BY created_at DESC LIMIT 10"
//             );
//             return res.json(recent);
//         }

//         const categoryIds = cats.map(c => c.category_id);
//         const placeholders = categoryIds.map(() => '?').join(',');

//         const [recommended] = await pool.query(`
//             SELECT 
//                 p.id, 
//                 p.name, 
//                 p.price, 
//                 p.image_url, 
//                 c.name AS category_name
//             FROM products p
//             LEFT JOIN categories c ON p.category_id = c.id
//             WHERE p.category_id IN (${placeholders})
//             ORDER BY RAND()
//             LIMIT 10
//         `, categoryIds);

//         res.json(recommended);

//     } catch (err) {
//         console.error("Error fetching recommendations:", err);
//         res.status(500).json({ message: "Error fetching recommendations" });
//     }
// });
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const [cats] = await pool.query(`
            SELECT p.category_id, COUNT(*) AS views
            FROM user_activity ua
            JOIN products p ON ua.product_id = p.id
            WHERE ua.user_id = ? AND ua.action = 'view'
            GROUP BY p.category_id
            ORDER BY views DESC
            LIMIT 3
        `, [req.user.id]);

        // If user has no history → show latest products
        if (cats.length === 0) {
            const [recent] = await pool.query(
                "SELECT * FROM products ORDER BY created_at DESC LIMIT 10"
            );
            return res.json(recent);
        }

        // Extract category IDs & remove null
        const categoryIds = cats
            .map(c => c.category_id)
            .filter(id => id !== null);

        if (categoryIds.length === 0) {
            const [recent] = await pool.query(
                "SELECT * FROM products ORDER BY created_at DESC LIMIT 10"
            );
            return res.json(recent);
        }

        const placeholders = categoryIds.map(() => '?').join(',');

        const [recommended] = await pool.query(`
            SELECT 
                p.id, 
                p.name, 
                p.price, 
                p.image_url, 
                c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.category_id IN (${placeholders})
            ORDER BY RAND()
            LIMIT 10
        `, categoryIds);

        // fallback if no products matched
        if (recommended.length === 0) {
            const [recent] = await pool.query(
                "SELECT * FROM products ORDER BY created_at DESC LIMIT 10"
            );
            return res.json(recent);
        }

        res.json(recommended);

    } catch (err) {
        console.error("Error fetching recommendations:", err);
        res.status(500).json({ message: "Error fetching recommendations" });
    }
});

/* -----------------------------------------
   SENTIMENT-BASED RECOMMENDATIONS
------------------------------------------*/
router.get("/sentiment-based/:productId", async (req, res) => {
    const { productId } = req.params;

    try {
        const [prodCat] = await pool.query(
            "SELECT category_id FROM products WHERE id = ?",
            [productId]
        );

        if (!prodCat.length) {
            return res.json({ positive: [], neutral: [], poor: [] });
        }

        const categoryId = prodCat[0].category_id;

        const [products] = await pool.query(`
            SELECT 
                p.id,
                p.name,
                p.price,
                p.image_url,
                COALESCE(AVG(r.review_star), 0) AS avg_rating,
                COALESCE(AVG(r.sentiment_score), 0) AS avg_sentiment
            FROM products p
            LEFT JOIN product_reviews r ON p.id = r.product_id
            WHERE p.category_id = ? AND p.id != ?
            GROUP BY p.id
            ORDER BY avg_sentiment DESC;
        `, [categoryId, productId]);

        const positive = [];
        const neutral = [];
        const poor = [];

        products.forEach(p => {
            const rating = Number(p.avg_rating);
            const sentiment = Number(p.avg_sentiment);

            if (rating >= 4 || sentiment >= 0.3) {
                positive.push(p);
            } else if ((rating >= 2.5 && rating < 4) || (sentiment > -0.2 && sentiment < 0.3)) {
                neutral.push(p);
            } else {
                poor.push(p);
            }
        });

        res.json({ positive, neutral, poor });

    } catch (err) {
        console.error("Sentiment Recommendation Error:", err);
        res.status(500).json({ message: "Error fetching sentiment-based recommendations" });
    }
});

router.delete("/reset", isAuthenticated, async (req, res) => {
    try {
        await pool.query("DELETE FROM user_activity WHERE user_id = ?", [req.user.id]);

        res.json({ message: "Personalization reset successfully" });
    } catch (err) {
        console.error("Reset Personalization Error:", err);
        res.status(500).json({ message: "Error resetting personalization" });
    } 
});

export default router;
