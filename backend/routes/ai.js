import express from "express";
import { pool } from "../config/db.js";

const adminAiRouter = express.Router();

/* ---------- NUMERIC HELPERS ---------- */
function linearRegression(xs, ys) {
    const n = xs.length;
    if (n === 0) return { m: 0, b: 0 };
    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;

    xs.forEach((x, i) => {
        num += (x - meanX) * (ys[i] - meanY);
        den += (x - meanX) ** 2;
    });

    return { m: den === 0 ? 0 : num / den, b: meanY - (den === 0 ? 0 : num / den) * meanX };
}

function mean(arr) { return arr.reduce((a, b) => a + b, 0) / (arr.length || 1); }
function stddev(arr) {
    const m = mean(arr);
    return Math.sqrt(mean(arr.map(x => (x - m) ** 2)));
}
function normalize01(x, min, max) {
    if (max === min) return 0.5;
    return (x - min) / (max - min);
}

/* -----------------------------------------------
   1) SALES FORECAST (linear regression)
-------------------------------------------------*/
adminAiRouter.get("/sales-forecast", async (req, res) => {
    try {
        const days = Number(req.query.days || 180);
        const forecastDays = Number(req.query.forecast || 30);

        const [rows] = await pool.query(`
            SELECT DATE(created_at) AS date, SUM(total_amount) AS revenue
            FROM orders
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            AND status != 'cancelled'
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at)
        `, [days]);

        const map = {};
        rows.forEach(r => map[r.date] = Number(r.revenue));

        const history = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const iso = d.toISOString().slice(0, 10);
            history.push({ date: iso, revenue: map[iso] || 0 });
        }

        const xs = history.map((_, i) => i);
        const ys = history.map(h => h.revenue);
        const { m, b } = linearRegression(xs, ys);

        const forecast = [];
        for (let i = 1; i <= forecastDays; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const iso = d.toISOString().slice(0, 10);
            forecast.push({
                date: iso,
                revenue: Number((m * (xs.length + i) + b).toFixed(2))
            });
        }

        res.json({ history, forecast });
    }
    catch (err) {
        console.error("Sales forecast error:", err);
        res.status(500).json({ error: "Internal error", details: err.message });
    }
});


/* -----------------------------------------------
   2) PRODUCT PERFORMANCE
-------------------------------------------------*/
adminAiRouter.get("/product-performance", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.id, p.name,
                COALESCE(SUM(CASE WHEN o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN oi.quantity END),0) AS qty_30,
                COALESCE(SUM(CASE WHEN o.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN oi.quantity END),0)  AS qty_7,
                p.stock_quantity
            FROM products p
            LEFT JOIN order_items oi ON oi.product_id = p.id
            LEFT JOIN orders o ON o.id = oi.order_id
            GROUP BY p.id
        `);

        res.json({ products: rows });
    }
    catch (err) {
        console.error("Product performance error:", err);
        res.status(500).json({ error: "Internal error" });
    }
});


/* -----------------------------------------------
   3) CHURN PREDICTION
-------------------------------------------------*/
adminAiRouter.get("/churn-prediction", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT u.id, u.username, u.created_at,
                COALESCE(MAX(o.created_at), u.created_at) AS last_order_at,
                COUNT(o.id) AS order_count
            FROM users u
            LEFT JOIN orders o ON o.user_id = u.id
            GROUP BY u.id
        `);

        const today = new Date();

        const result = rows.map(u => {
            const last = new Date(u.last_order_at);
            const days = Math.floor((today - last) / 86400000);
            const churn = days > 90 ? "High" : days > 45 ? "Medium" : "Low";
            return { ...u, recency_days: days, churn };
        });

        res.json({ customers: result });
    }
    catch (err) {
        console.error("Churn error:", err);
        res.status(500).json({ error: "Internal error" });
    }
});


/* -----------------------------------------------
   4) ANOMALY DETECTION
-------------------------------------------------*/
adminAiRouter.get("/anomalies", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DATE(created_at) AS date, SUM(total_amount) AS revenue
            FROM orders
            GROUP BY DATE(created_at)
        `);

        const revs = rows.map(r => Number(r.revenue));
        const m = mean(revs);
        const s = stddev(revs);

        const anomalies = rows.filter(r => {
            const z = (r.revenue - m) / (s || 1);
            return Math.abs(z) > 2;
        });

        res.json({ anomalies });
    }
    catch (err) {
        console.error("Anomaly error:", err);
        res.status(500).json({ error: "Internal error" });
    }
});

export default adminAiRouter;
