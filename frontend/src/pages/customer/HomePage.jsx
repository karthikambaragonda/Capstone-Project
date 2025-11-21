import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/customer/ProductCard";
import { motion } from "framer-motion";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [history, setHistory] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, historyRes, recRes] = await Promise.all([
                    axios.get("/api/products"),
                    axios.get("/api/user/history", { withCredentials: true }),
                    axios.get("/api/recommendations", { withCredentials: true }),
                ]);

                setProducts(productsRes.data);
                setHistory(historyRes.data);
                setRecommendations(recRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-xl font-semibold text-gray-700">
                Loading…
            </div>
        );
    }

    return (
        <div className="w-full bg-[#fafafa] min-h-screen text-gray-900">

            {/* -------------------------------------- */}
            {/* 🍏 APPLE STYLE HERO BANNER              */}
            {/* -------------------------------------- */}
            <section className="w-full py-20 text-center bg-white border-b border-gray-200">
                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl font-semibold tracking-tight mb-4"
                >
                    Welcome to <span className="font-bold">ShopNest</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-gray-600"
                >
                    Shop differently. Shop beautifully.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <a
                        href="/customer/allproducts"
                        className="mt-6 inline-block bg-black text-white px-8 py-3 rounded-full 
                        text-lg font-medium hover:bg-gray-900 transition"
                    >
                        Explore Products
                    </a>
                </motion.div>
            </section>


            <div className="max-w-7xl mx-auto px-6 py-16 space-y-28">

                {/* -------------------------------------- */}
                {/* 🍏 RECOMMENDATIONS                     */}
                {/* -------------------------------------- */}
                {recommendations.length > 0 && (
                    <section>
                        <AppleSectionHeader title="Recommended for You" />

                        <AppleGrid>
                            {recommendations.map((product, index) => (
                                <Fade key={product.id} index={index}>
                                    <ProductCard product={product} />
                                </Fade>
                            ))}
                        </AppleGrid>
                    </section>
                )}

                {/* -------------------------------------- */}
                {/* 🍏 TRENDING                            */}
                {/* -------------------------------------- */}
                <section>
                    <AppleSectionHeader title="Trending Now" />
                    <AppleGrid>
                        {products.slice(4, 12).map((product, index) => (
                            <Fade key={product.id} index={index}>
                                <ProductCard product={product} />
                            </Fade>
                        ))}
                    </AppleGrid>
                </section>

                {/* -------------------------------------- */}
                {/* 🍏 RECENTLY VIEWED                     */}
                {/* -------------------------------------- */}
                {history.length > 0 && (
                    <section>
                        <AppleSectionHeader title="Recently Viewed" />

                        <div className="overflow-x-auto flex gap-6 pt-4 scrollbar-hide">
                            {history.map((product) => (
                                <div key={product.id} className="min-w-[260px]">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

/* ------------------------------------------- */
/* 🍏 Apple Style Subcomponents                */
/* ------------------------------------------- */

function AppleSectionHeader({ title }) {
    return (
        <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-semibold mb-10 tracking-tight text-center"
        >
            {title}
        </motion.h2>
    );
}

function AppleGrid({ children }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {children}
        </div>
    );
}

function Fade({ children, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
        >
            {children}
        </motion.div>
    );
}
