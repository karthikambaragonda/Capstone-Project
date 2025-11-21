import cron from "node-cron";
import { pool } from "../config/db.js";
import { checkPriceAlerts } from "./priceAlertService.js";

export function startPriceCron() {
    cron.schedule("*/4 * * * *", async () => {
        console.log("⚙ Updating product prices...");

        try {
            const [products] = await pool.query(
                "SELECT id, price, base_price FROM products"
            );

            for (let product of products) {
                const basePrice = product.base_price;

                const randomFactor = Math.random();
                let changePercent;

                if (randomFactor < 0.3) {
                    changePercent = Math.random() * 0.02; // 0–2% increase
                } else {
                    changePercent = -(Math.random() * 0.10); // -0–10% decrease
                }

                const newPrice = Math.max(
                    1,
                    +(basePrice * (1 + changePercent)).toFixed(2)
                );

                await pool.query(
                    "UPDATE products SET price = ? WHERE id = ?",
                    [newPrice, product.id]
                );

                await checkPriceAlerts(product.id);
            }

            console.log("✔ Prices updated & alerts checked.");

        } catch (err) {
            console.error("❌ Error updating prices:", err);
        }
    });
}
