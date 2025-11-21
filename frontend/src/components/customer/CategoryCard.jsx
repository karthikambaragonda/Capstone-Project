import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

export default function CategoryCard({ category }) {
    const categoryImages = {
        'Electronics': 'https://th.bing.com/th/id/R.0770c13569f4bb5c4b6642ec2c4e8fcb?rik=BdUfnCWbVF3qMw&riu=http%3a%2f%2f1.bp.blogspot.com%2f-Dt4zQZIq_U4%2fTvfeRMwptnI%2fAAAAAAAAEOg%2fhp_0XRDmQCY%2fs1600%2fmonkey_5.jpg&ehk=siLundgNms%2bK3A5an9i4sxDAE4XQUmOwdnzF6cdHPrM%3d&risl=&pid=ImgRaw&r=0',
        'default': 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?w=600&auto=format&fit=crop&q=60'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.25 }}
            className="bg-white border border-gray-200 rounded-3xl shadow-sm 
                       hover:shadow-md transition-all duration-300"
        >
            <Link
                to={`/customer/categories/${category.id}`}
                className="block"
            >
                {/* IMAGE */}
                <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-t-3xl bg-white">
                    <img
                        src={categoryImages[category.name] || categoryImages.default}
                        alt={category.name}
                        className="w-full h-full object-cover transition-all duration-500 
                                   group-hover:scale-105"
                    />
                </div>

                {/* TEXT */}
                <div className="p-5 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                        {category.name}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                        Explore {category.name}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
