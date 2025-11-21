import { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryCard from '../../../components/customer/CategoryCard';
import { motion } from 'framer-motion';

export default function LandingPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesRes = await axios.get('/api/categories');
                setCategories(categoriesRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-xl text-gray-600">
                Loading…
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-xl text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full bg-[#fafafa] min-h-screen pb-20">

            {/* ---------------- APPLE Style Header ---------------- */}
            <div className="text-center py-16 border-b border-gray-200 bg-white">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl font-semibold text-gray-900 tracking-tight"
                >
                    Shop by Category
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 text-lg mt-3"
                >
                    Explore products curated beautifully for you.
                </motion.p>
            </div>

            {/* ---------------- Apple Style Category Grid ---------------- */}
            <div className="max-w-7xl mx-auto px-6 pt-16">
                <div className="
                    grid 
                    grid-cols-1 
                    sm:grid-cols-2 
                    md:grid-cols-3 
                    lg:grid-cols-4 
                    gap-12
                ">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <CategoryCard category={category} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
