import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import clothing from '../../assets/images/clothing.jpg';
import Groceries from '../../assets/images/Groceries.png';
import sports from '../../assets/images/sports.png';
import toys from '../../assets/images/toys.png';
import book from '../../assets/images/book.png';
import Beauty from '../../assets/images/Beauty.png';
import auto from '../../assets/images/auto.png';
import Stationery from '../../assets/images/Stationery.png';
import Home from '../../assets/images/home.jpg';
import jewellery from '../../assets/images/jewellery.jpg';
import Pet from '../../assets/images/pet.jpg';
import foot from '../../assets/images/foot.jpg';
import music from '../../assets/images/music.jpg';
import baby from '../../assets/images/baby.jpg';
import kitchen from '../../assets/images/kitchen.jpg';
import Gardening from '../../assets/images/Gardening.jpg';
import travel from '../../assets/images/travel.jpg';
import electonics from '../../assets/images/electonics.jpg';




export default function CategoryCard({ category }) {
    const categoryImages = {
        'default': 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?w=600&auto=format&fit=crop&q=60',
        'Clothing': clothing,
        'Groceries': Groceries,
        'Sports': sports,
        'Toys & Games': toys,
        'Books': book,
        'Beauty & Health': Beauty,
        'Automobile Accessories': auto,
        'Stationery': Stationery,
        'Home Appliances': Home,
        'Jewellery': jewellery,
        'Pet Supplies': Pet,
        'Footwear': foot,
        'Musical Instruments': music,
        'Baby Products': baby,
        'Kitchenware': kitchen,
        'Gardening': Gardening,
        'Travel & Luggage': travel,
        'Electronics': electonics

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
                <div className="w-full h-60 flex items-center justify-center overflow-hidden rounded-t-3xl bg-white">
                    <img
                        src={categoryImages[category.name] || categoryImages.default}
                        alt={category.name}
                        className="w-full h-full object-fit transition-all duration-500 
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
