import cron from "node-cron";
import { pool } from "../config/db.js";
import { checkPriceAlerts } from "./priceAlertService.js";

export function startAlertCron() {
    cron.schedule("0 */1 * * * *", async () => {
        console.log("⏰ Checking price alerts...");

        try {
            const [products] = await pool.query("SELECT id FROM products");

            for (let product of products) {
                await checkPriceAlerts(product.id);
            }

        } catch (err) {
            console.error("❌ Error in alert cron:", err);
        }
    });
}
