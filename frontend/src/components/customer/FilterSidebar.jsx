import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function FilterSidebar({ filters, onFilterChange, onClose, categories }) {
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        const updatedCategories = checked
            ? [...localFilters.category, value]
            : localFilters.category.filter((cat) => cat !== value);

        const updatedFilters = { ...localFilters, category: updatedCategories };
        setLocalFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        const updatedFilters = {
            ...localFilters,
            price: { ...localFilters.price, [name]: Number(value) },
        };
        setLocalFilters(updatedFilters);
    };

    const handleApplyFilters = () => {
        onFilterChange(localFilters);
        if (onClose) onClose();
    };

    const handleClearFilter = (type, value) => {
        let updatedFilters = { ...localFilters };
        if (type === "category") {
            updatedFilters.category = updatedFilters.category.filter((cat) => cat !== value);
        }
        setLocalFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    const handleClearAll = () => {
        const cleared = { category: [], price: { min: "", max: "" } };
        setLocalFilters(cleared);
        onFilterChange(cleared);
    };

    return (
        <div className="
            flex flex-col h-full 
            bg-white/70 backdrop-blur-xl 
            p-6 rounded-3xl border border-gray-200 
            shadow-[0_3px_15px_rgba(0,0,0,0.08)]
            md:shadow-none md:bg-transparent md:border-none
            md:p-0
        ">
            {/* Header (mobile) */}
            <div className="flex justify-between items-center mb-6 md:hidden">
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Filters</h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                >
                    <FiX size={22} className="text-gray-700" />
                </button>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">

                {/* Applied Filter Pills */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                            Applied Filters
                        </h3>

                        {(localFilters.category.length > 0 ||
                            localFilters.price.min ||
                            localFilters.price.max) && (
                                <button
                                    onClick={handleClearAll}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    Clear All
                                </button>
                            )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {localFilters.category.map((cat) => (
                            <div
                                key={cat}
                                className="
                                    inline-flex items-center 
                                    bg-gray-100 text-gray-800 
                                    px-3 py-1 rounded-full text-sm
                                    shadow-sm
                                "
                            >
                                {cat}
                                <button
                                    onClick={() => handleClearFilter("category", cat)}
                                    className="ml-2 text-gray-500 hover:text-gray-900"
                                >
                                    <FiX size={12} />
                                </button>
                            </div>
                        ))}

                        {(localFilters.price.min || localFilters.price.max) && (
                            <div className="inline-flex items-center bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full shadow-sm">
                                ${localFilters.price.min || "0"} – ${localFilters.price.max || "∞"}
                                <button
                                    onClick={() => handleClearFilter("price")}
                                    className="ml-2 text-gray-500 hover:text-gray-900"
                                >
                                    <FiX size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                        Categories
                    </h3>

                    <div className="space-y-3">
                        {categories.length ? (
                            categories.map((cat) => (
                                <label
                                    key={cat.id}
                                    className="
                                        flex items-center justify-between 
                                        p-2 rounded-xl
                                        hover:bg-gray-100 transition cursor-pointer
                                    "
                                >
                                    <span className="text-gray-800 capitalize">{cat.name}</span>
                                    <input
                                        type="checkbox"
                                        value={cat.name}
                                        checked={localFilters.category.includes(cat.name)}
                                        onChange={handleCategoryChange}
                                        className="
                                            h-5 w-5 rounded-md text-blue-600
                                            focus:ring-blue-500
                                        "
                                    />
                                </label>
                            ))
                        ) : (
                            <p className="text-gray-400 italic text-sm">No categories available</p>
                        )}
                    </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                        Price Range
                    </h3>

                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            name="min"
                            value={localFilters.price.min}
                            onChange={handlePriceChange}
                            placeholder="Min"
                            className="
                w-1/2 p-2.5 text-sm 
                border border-gray-300 rounded-xl
                focus:ring-2 focus:ring-blue-500 
                shadow-sm
            "
                        />
                        <span className="text-gray-500 font-medium text-lg">–</span>
                        <input
                            type="number"
                            name="max"
                            value={localFilters.price.max}
                            onChange={handlePriceChange}
                            placeholder="Max"
                            className="
                w-1/2 p-2.5 text-sm 
                border border-gray-300 rounded-xl
                focus:ring-2 focus:ring-blue-500 
                shadow-sm
            "
                        />
                    </div>

                    {/* NEW Apply button inside price section */}
                    <button
                        onClick={handleApplyFilters}
                        className="
            mt-4 w-full py-2.5 
            bg-black text-white text-sm font-semibold 
            rounded-xl 
            shadow-[0_3px_10px_rgba(0,0,0,0.15)]
            hover:bg-gray-900 transition
        "
                    >
                        Apply
                    </button>
                </div>
            </div>

            {/* Mobile Apply Button */}
            <div className="md:hidden sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
                <button
                    onClick={handleApplyFilters}
                    className="
                        w-full py-3 rounded-xl 
                        bg-black text-white text-lg 
                        font-semibold tracking-tight
                        hover:bg-gray-900 transition
                        shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                    "
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}
