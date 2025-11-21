import { pool } from "../config/db.js";
import { sendNotification } from "./emailService.js";

export const checkPriceAlerts = async (productId) => {
    try {
        const [productRows] = await pool.query(
            "SELECT price, name FROM products WHERE id = ?",
            [productId]
        );

        const product = productRows[0];
        if (!product) return;

        const [alerts] = await pool.query(`
            SELECT pa.id, pa.user_id, pa.target_price, u.email
            FROM price_alerts pa
            JOIN users u ON pa.user_id = u.id
            WHERE pa.product_id = ? AND pa.notified = 0
        `, [productId]);

        for (let alert of alerts) {
            if (product.price <= alert.target_price) {
                await sendNotification(
                    alert.email,
                    product.name,
                    product.price,
                    alert.target_price
                );

                await pool.query(
                    "UPDATE price_alerts SET notified = 1 WHERE id = ?",
                    [alert.id]
                );
            }
        }
    } catch (err) {
        console.error("❌ Error checking price alerts:", err);
    }
};
