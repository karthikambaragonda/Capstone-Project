import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/* -----------------------------------------
   ADMIN DASHBOARD STATS
------------------------------------------*/
router.get("/stats", async (req, res) => {
    try {
        const [[{ total_users }]] = await pool.query(
            "SELECT COUNT(*) AS total_users FROM users"
        );

        const [[{ total_orders }]] = await pool.query(
            "SELECT COUNT(*) AS total_orders FROM orders"
        );

        const [[{ total_revenue }]] = await pool.query(
            "SELECT IFNULL(SUM(final_amount), 0) AS total_revenue FROM orders"
        );

        const [[{ today_revenue }]] = await pool.query(
            "SELECT IFNULL(SUM(final_amount), 0) AS today_revenue FROM orders WHERE DATE(created_at) = CURDATE()"
        );

        const [[{ total_products }]] = await pool.query(
            "SELECT COUNT(*) AS total_products FROM products"
        );

        const [[{ low_stock }]] = await pool.query(
            "SELECT COUNT(*) AS low_stock FROM products WHERE stock_quantity < 5"
        );

        const [[{ total_categories }]] = await pool.query(
            "SELECT COUNT(*) AS total_categories FROM categories"
        );

        const [[{ pending_orders }]] = await pool.query(`
            SELECT COUNT(*) AS pending_orders 
            FROM orders 
            WHERE status = 'pending'
        `);

        const [[{ cancelled_orders }]] = await pool.query(`
            SELECT COUNT(*) AS cancelled_orders 
            FROM orders 
            WHERE status = 'cancelled'
        `);

        res.json({
            total_users,
            total_orders,
            total_revenue,
            today_revenue,
            total_products,
            low_stock,
            total_categories,
            pending_orders,
            cancelled_orders,
        });

    } catch (err) {
        console.error("Error fetching admin stats:", err);
        res.status(500).json({ message: "Failed to load admin stats" });
    }
});

/* -----------------------------------------
   SALES BY CATEGORY
------------------------------------------*/
router.get("/sales-by-category", async (req, res) => {
    const query = `
        SELECT 
            c.name AS category, 
            SUM(oi.quantity * oi.price) AS total_sales
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        GROUP BY c.id
        ORDER BY total_sales DESC;
    `;

    try {
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Database error", details: err });
    }
});

/* -----------------------------------------
   CUSTOMER GROWTH (LAST 12 MONTHS)
------------------------------------------*/
router.get("/customer-growth", async (req, res) => {
    const query = `
        SELECT 
            DATE_FORMAT(MIN(created_at), '%b') AS month,
            COUNT(*) AS users
        FROM users
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY YEAR(created_at), MONTH(created_at)
        ORDER BY YEAR(created_at), MONTH(created_at);
    `;

    try {
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error("Customer Growth Error:", err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

/* -----------------------------------------
   LOW STOCK PRODUCTS
------------------------------------------*/
router.get("/low-stock", async (req, res) => {
    const query = `
        SELECT 
            id, 
            name, 
            stock_quantity
        FROM products
        WHERE stock_quantity < 10
        ORDER BY stock_quantity ASC;
    `;

    try {
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Database error", details: err });
    }
});

/* -----------------------------------------
   WEEKLY ACTIVE USERS
------------------------------------------*/
router.get("/weekly-active-users", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                DATE(created_at) AS day,
                COUNT(DISTINCT user_id) AS active
            FROM orders
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
              AND status != 'cancelled'
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at)
        `);

        const result = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const iso = d.toISOString().slice(0, 10);

            const match = rows.find(r => r.day === iso);

            result.push({
                day: iso.slice(5),
                active: match ? match.active : 0,
            });
        }

        res.json(result);

    } catch (err) {
        console.error("Weekly Active Users Error:", err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

router.get("/order-status-count", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT status, COUNT(*) AS count
            FROM orders
            GROUP BY status
        `);

        const output = {};
        rows.forEach(r => output[r.status] = r.count);

        res.json(output);

    } catch (err) {
        console.error("Order Status Count Error:", err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

router.get("/recent-orders", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                o.id AS order_id,
                o.total_amount,
                o.final_amount,
                o.status,
                o.created_at,
                u.username,
                (
                    SELECT COUNT(*) 
                    FROM order_items 
                    WHERE order_id = o.id
                ) AS item_count
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT 10;
        `);

        res.json(rows);
    } catch (err) {
        console.error("Error fetching recent orders:", err);
        res.status(500).json({ message: "Failed to fetch recent orders" });
    }
});


router.get("/top-products", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.id,
                p.name,
                p.image_url,
                SUM(oi.quantity) AS total_sold,
                SUM(oi.quantity * oi.price) AS total_revenue
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            GROUP BY p.id, p.name, p.image_url
            ORDER BY total_sold DESC
            LIMIT 10;
        `);

        res.json(rows);
    } catch (err) {
        console.error("Error fetching top products:", err);
        res.status(500).json({ message: "Failed to fetch top products" });
    }
});
export default router;
