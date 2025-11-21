import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ShoppingCartIcon,
    GiftIcon,
    BellAlertIcon,
    ChartPieIcon,
    SparklesIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';

export default function Showcase() {

    const features = [
        {
            icon: GiftIcon,
            title: "Gamification & Rewards",
            desc: "Earn points, redeem perks, and unlock badges designed to make shopping fun.",
        },
        {
            icon: SparklesIcon,
            title: "AI Product Intelligence",
            desc: "Smart recommendations powered by deep learning tailored uniquely for you.",
        },
        {
            icon: ChartPieIcon,
            title: "Spending Insights",
            desc: "Visualize your monthly spend patterns with clean, Apple-style analytics.",
        },
        {
            icon: BellAlertIcon,
            title: "Price Drop Alerts",
            desc: "Stay notified instantly when prices fall below your target.",
        },
        {
            icon: ShoppingCartIcon,
            title: "Smart Shopping Journey",
            desc: "Seamless cart, instant checkout, and lightning-fast browsing.",
        },
        {
            icon: MagnifyingGlassIcon,
            title: "Advanced Search",
            desc: "Find the perfect item effortlessly with fuzzy matching + AI rank boosting.",
        },
    ];

    return (
        <div className="min-h-screen bg-[#f5f5f7] text-gray-800">

            {/* ---------------- Apple Hero ---------------- */}
            <section className="text-center py-24">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl font-semibold text-black tracking-tight"
                    style={{ fontFamily: "-apple-system" }}
                >
                    ShopNest
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-xl text-gray-600 mt-4"
                >
                    AI-Enhanced Shopping Experience.
                </motion.p>

                <p className="text-gray-500 max-w-xl mx-auto mt-6 leading-relaxed">
                    A beautifully crafted e-commerce platform built with intelligence,
                    personalization, analytics, and delight — inspired by Apple’s design philosophy.
                </p>

                {/* CTA Buttons */}
                <div className="flex justify-center gap-4 mt-10">
                    <Link to="/customer" target='_blank'>
                        <button className=" bg-black text-white px-8 py-3 rounded-2xl text-lg font-medium hover:bg-neutral-900 transition-all">
                            Explore →
                        </button>
                    </Link>

                    <Link to="/admin" target='_blank'>
                        <button className="bg-white border border-gray-300 px-8 py-3 rounded-2xl text-lg font-medium hover:bg-gray-100 transition-all">
                            Admin Login →
                        </button>
                    </Link>
                </div>
            </section>

            {/* ---------------- Features (Apple grid style) ---------------- */}
            <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
                <h2 className="text-4xl font-semibold text-center text-black mb-14 tracking-tight">
                    Designed for a Smarter Shopping World.
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="
                                bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
                                rounded-3xl p-8 text-center border border-neutral-200 
                                hover:shadow-[0_10px_35px_rgba(0,0,0,0.15)]
                                transition-all backdrop-blur-xl
                            "
                        >
                            <div className="flex justify-center mb-6">
                                <f.icon className="h-12 w-12 text-black opacity-80" />
                            </div>

                            <h3 className="text-xl font-semibold text-black mb-2">{f.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ---------------- About Section ---------------- */}
            <section className="py-24 px-6 max-w-3xl mx-auto text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-semibold text-black tracking-tight"
                >
                    About ShopNest
                </motion.h2>

                <p className="text-gray-600 mt-6 leading-relaxed text-lg">
                    ShopNest is a next-generation shopping experience crafted with
                    <b> React, Node.js, and MySQL</b>, enhanced with AI-based personalization, price alerts,
                    sentiment intelligence, and user analytics — all wrapped inside a clean and minimalist.
                </p>
            </section>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-400 text-sm">
                © {new Date().getFullYear()} ShopNest — Crafted with ❤️ & Precision.
            </footer>
        </div>
    );
}
