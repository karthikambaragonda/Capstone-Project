import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../../components/customer/ProductCard';
import { motion } from "framer-motion";

export default function CategoryPage() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryRes, productsRes] = await Promise.all([
                    axios.get(`/api/categories/${id}`),
                    axios.get(`/api/products/categories/${id}`)
                ]);

                setCategory(categoryRes.data[0]);
                setProducts(productsRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-600 text-lg">
                Loading…
            </div>
        );
    }

    return (
        <div className="bg-[#fafafa] min-h-screen px-6 py-16">

            {/* ---------- Apple Header ---------- */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto text-center mb-16"
            >
                <h1 className="text-5xl font-semibold tracking-tight text-gray-900 mb-4">
                    {category?.name || "Category"}
                </h1>

                {category?.description && (
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {category.description}
                    </p>
                )}
            </motion.div>

            {/* ---------- Products Grid ---------- */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-7xl mx-auto"
            >
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl">
                            No products available in this category.
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
