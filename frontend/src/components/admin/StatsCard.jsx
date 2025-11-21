import React from 'react';
import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, color }) {
    const colorMap = {
        blue: "text-blue-600 bg-blue-100/60",
        green: "text-green-600 bg-green-100/60",
        purple: "text-purple-600 bg-purple-100/60",
        yellow: "text-yellow-600 bg-yellow-100/60",
        emerald: "text-emerald-600 bg-emerald-100/60"
    };

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className="
                relative p-6 rounded-3xl
                backdrop-blur-xl bg-white/70
                border border-gray-200/70
                shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                transition-all
            "
        >
            {/* Inner subtle highlight */}
            <div className="absolute inset-0 rounded-3xl bg-white/30 pointer-events-none"></div>

            <div className="relative z-10 flex items-center justify-between">
                {/* Text section */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
                        {title}
                    </p>
                    <p className="mt-1 text-4xl font-semibold text-gray-900">
                        {value}
                    </p>
                </div>

                {/* Frosted icon capsule */}
                <div
                    className={`
                        p-4 rounded-2xl shadow-sm backdrop-blur-xl 
                        border border-gray-200 bg-white/80
                        ${colorMap[color] || "text-gray-700 bg-gray-100/80"}
                    `}
                >
                    <Icon className="h-7 w-7" />
                </div>
            </div>
        </motion.div>
    );
}
