// import { useEffect, useState } from "react";
// import axios from "axios";
// import ProductCard from "../../components/customer/ProductCard";
// import { motion } from "framer-motion";

// export default function HomePage() {
//     const [products, setProducts] = useState([]);
//     const [history, setHistory] = useState([]);
//     const [recommendations, setRecommendations] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [productsRes, historyRes, recRes] = await Promise.all([
//                     axios.get("/api/products"),
//                     axios.get("/api/user/history", { withCredentials: true }),
//                     axios.get("/api/recommendations", { withCredentials: true }),
//                 ]);

//                 setProducts(productsRes.data);
//                 setHistory(historyRes.data);
//                 setRecommendations(recRes.data);
//             } catch (err) {
//                 console.error("Error fetching data:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64 text-xl font-semibold text-gray-700">
//                 Loading…
//             </div>
//         );
//     }

//     return (
//         <div className="w-full bg-[#fafafa] min-h-screen text-gray-900">

//             {/* -------------------------------------- */}
//             {/* 🍏 APPLE STYLE HERO BANNER              */}
//             {/* -------------------------------------- */}
//             <section className="w-full py-20 text-center bg-white border-b border-gray-200">
//                 <motion.h1
//                     initial={{ opacity: 0, y: 15 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6 }}
//                     className="text-5xl font-semibold tracking-tight mb-4"
//                 >
//                     Welcome to <span className="font-bold">ShopNest</span>
//                 </motion.h1>

//                 <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.3 }}
//                     className="text-xl text-gray-600"
//                 >
//                     Shop differently. Shop beautifully.
//                 </motion.p>

//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.6 }}
//                 >
//                     <a
//                         href="/customer/allproducts"
//                         className="mt-6 inline-block bg-black text-white px-8 py-3 rounded-full
//                         text-lg font-medium hover:bg-gray-900 transition"
//                     >
//                         Explore Products
//                     </a>
//                 </motion.div>
//             </section>


//             <div className="max-w-7xl mx-auto px-6 py-16 space-y-28">

//                 {/* -------------------------------------- */}
//                 {/* 🍏 RECOMMENDATIONS                     */}
//                 {/* -------------------------------------- */}
//                 {recommendations.length > 0 && (
//                     <section>

//                         {/* ⭐ INFO CARD — recommended based on user activity */}
//                         <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-sm mb-10 max-w-3xl mx-auto text-center">
//                             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                                 Personalized for You 🎯
//                             </h3>

//                             <p className="text-gray-600 text-sm leading-relaxed">
//                                 These products are recommended based on your browsing history,
//                                 items you’ve viewed, and your overall shopping activity.
//                             </p>

//                             <p className="text-gray-500 text-xs mt-2">
//                                 Recommendations improve as you explore more products.
//                             </p>
//                         </div>

//                         <AppleSectionHeader title="Recommended for You" />

//                         <AppleGrid>
//                             {recommendations.map((product, index) => (
//                                 <Fade key={product.id} index={index}>
//                                     <ProductCard product={product} />
//                                 </Fade>
//                             ))}
//                         </AppleGrid>
//                     </section>
//                 )}
//                 {/* -------------------------------------- */}
//                 {/* 🍏 TRENDING                            */}
//                 {/* -------------------------------------- */}
//                 <section>
//                     <AppleSectionHeader title="Trending Now" />
//                     <AppleGrid>
//                         {products.slice(4, 12).map((product, index) => (
//                             <Fade key={product.id} index={index}>
//                                 <ProductCard product={product} />
//                             </Fade>
//                         ))}
//                     </AppleGrid>
//                 </section>

//                 {/* -------------------------------------- */}
//                 {/* 🍏 RECENTLY VIEWED                     */}
//                 {/* -------------------------------------- */}
//                 {history.length > 0 && (
//                     <section>
//                         <AppleSectionHeader title="Recently Viewed" />

//                         <div className="overflow-x-auto flex gap-6 pt-4 scrollbar-hide">
//                             {history.map((product) => (
//                                 <div key={product.id} className="min-w-[260px]">
//                                     <ProductCard product={product} />
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 )}
//             </div>
//         </div>
//     );
// }

// /* ------------------------------------------- */
// /* 🍏 Apple Style Subcomponents                */
// /* ------------------------------------------- */

// function AppleSectionHeader({ title }) {
//     return (
//         <motion.h2
//             initial={{ opacity: 0, y: 10 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-3xl sm:text-4xl font-semibold mb-10 tracking-tight text-center"
//         >
//             {title}
//         </motion.h2>
//     );
// }

// function AppleGrid({ children }) {
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
//             {children}
//         </div>
//     );
// }

// function Fade({ children, index }) {
//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 25 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: index * 0.05 }}
//         >
//             {children}
//         </motion.div>
//     );
// }
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/customer/ProductCard";
import { motion } from "framer-motion";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [history, setHistory] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [topP, setTopP] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, historyRes, recRes,topP] = await Promise.all([
                    axios.get("/api/products"),
                    axios.get("/api/user/history", { withCredentials: true }),
                    axios.get("/api/recommendations", { withCredentials: true }),
                    axios.get("/api/admin/top-productss", { withCredentials: true }),

                ]);

                setProducts(productsRes.data);
                setHistory(historyRes.data);
                setRecommendations(recRes.data);
                setTopP(topP.data)
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

            {/* 🍏 HERO */}
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


                {/* 🍏 RECOMMENDED SECTION */}
                <section>

                    <InfoCard
                        title="Personalized for You 🎯"
                        desc={
                            <>
                                These products are recommended based on your browsing behavior, viewed items, and shopping interactions.
                                <br />
                                You can reset your recommendations anytime from the Profile section.
                            </>
                        }
                        sub="Recommendations get smarter as you explore more products."
                        chips={["AI Based", "Activity Driven", "Smarter Everyday"]}
                    />

                    <AppleSectionHeader title="Recommended for You" />

                    {recommendations.length === 0 ? (
                        <EmptyState message="No recommendations available yet. Explore products to improve suggestions!" />
                    ) : (
                        <AppleGrid>
                            {recommendations.map((product, index) => (
                                <Fade key={product.id} index={index}>
                                    <ProductCard product={product} />
                                </Fade>
                            ))}
                        </AppleGrid>
                    )}
                </section>


                {/* 🍏 TRENDING SECTION */}
                <section>

                    <InfoCard
                        title="Top Selling Products 🏆"
                        desc="These products are the most purchased on ShopNest."
                        sub="Updated based on real sales data."
                        chips={["Best Sellers", "Top Rated", "Most Purchased"]}
                    />

                    <AppleSectionHeader title="Top Products" />

                    {topP.length === 0 ? (
                        <EmptyState message="No top products available right now." />
                    ) : (
                        <AppleGrid>
                            {topP.map((product, index) => (
                                <Fade key={product.id} index={index}>
                                    <ProductCard product={product} />
                                </Fade>
                            ))}
                        </AppleGrid>
                    )}
                </section>



                {/* 🍏 RECENTLY VIEWED SECTION */}
                <section>

                    <InfoCard
                        title="Your Recent Activity 👀"
                        desc="A quick look at products you've checked out recently so you can get back to them easily."
                        sub="Viewed items help improve your personalized recommendations."
                        chips={["Your History", "Your Interests", "Smart Tracking"]}
                    />

                    <AppleSectionHeader title="Recently Viewed" />

                    {history.length === 0 ? (
                        <EmptyState message="You haven't viewed any products yet." />
                    ) : (
                        <div className="overflow-x-auto flex gap-6 pt-4 scrollbar-hide">
                            {history.map((product) => (
                                <div key={product.id} className="min-w-[260px]">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}


/* 🍏 APPLE STYLE INFO CARD */
function InfoCard({ title, desc, sub, chips = [] }) {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-sm mb-10 max-w-3xl mx-auto text-center">

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
                {desc}
            </p>

            {sub && (
                <p className="text-gray-500 text-xs mt-2">
                    {sub}
                </p>
            )}

            {chips.length > 0 && (
                <div className="flex justify-center gap-3 mt-4 flex-wrap text-xs">
                    {chips.map((c, i) => (
                        <span
                            key={i}
                            className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200"
                        >
                            {c}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}


/* 🍏 EMPTY STATE COMPONENT */
function EmptyState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <p className="text-lg font-medium">{message}</p>
        </div>
    );
}


/* APPLE SUBCOMPONENTS */
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
