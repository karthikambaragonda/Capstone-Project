// import { useState, useMemo } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import ProductCard from "../../components/customer/ProductCard";

// export default function AiExplore() {
//     const [products, setProducts] = useState([]);
//     const [loaded, setLoaded] = useState(false);

//     /* -------------------- AI STATES -------------------- */
//     const [aiSearchQuery, setAiSearchQuery] = useState("");
//     const [aiSearchResults, setAiSearchResults] = useState([]);
//     const [aiSearchLoading, setAiSearchLoading] = useState(false);

//     const [aiSorted, setAiSorted] = useState([]);
//     const [aiSortLoading, setAiSortLoading] = useState(false);

//     const [tagProduct, setTagProduct] = useState(null);
//     const [aiTags, setAiTags] = useState([]);
//     const [aiTagLoading, setAiTagLoading] = useState(false);

//     const [descProduct, setDescProduct] = useState(null);
//     const [aiDescription, setAiDescription] = useState("");
//     const [aiDescLoading, setAiDescLoading] = useState(false);

//     const [chatOpen, setChatOpen] = useState(false);
//     const [chatMessages, setChatMessages] = useState([]);
//     const [chatInput, setChatInput] = useState("");
//     const [chatLoading, setChatLoading] = useState(false);

//     /* -------------------- LOAD PRODUCTS -------------------- */
//     const loadProducts = async () => {
//         if (loaded) return;
//         try {
//             const res = await axios.get("/api/products");
//             setProducts(res.data);
//         } catch (err) {
//             console.error("Failed to load products:", err);
//         } finally {
//             setLoaded(true);
//         }
//     };

//     const productMap = useMemo(
//         () => new Map(products.map((p) => [p.id, p])),
//         [products]
//     );

//     /* -------------------- AI SEARCH -------------------- */
//     const handleSearch = async (e) => {
//         e.preventDefault();
//         if (!aiSearchQuery.trim()) return;

//         await loadProducts();

//         setAiSearchLoading(true);
//         setAiSearchResults([]);

//         try {
//             const res = await axios.post("/api/ai/search", {
//                 query: aiSearchQuery,
//                 products
//             });

//             setAiSearchResults(res.data.ids || []);
//         } catch (err) {
//             console.error("AI Search Error:", err);
//         } finally {
//             setAiSearchLoading(false);
//         }
//     };

//     const searchProducts = aiSearchResults
//         .map((id) => productMap.get(id))
//         .filter(Boolean);

//     /* -------------------- AI SORTING -------------------- */
//     const handleSort = async () => {
//         await loadProducts();
//         setAiSortLoading(true);
//         setAiSorted([]);

//         try {
//             const res = await axios.post("/api/ai/sort", {
//                 products,
//                 criteria: "Sort by best value for customer",
//             });

//             const sortedIds = res.data.ids || [];
//             const sortedProducts = sortedIds
//                 .map((id) => productMap.get(id))
//                 .filter(Boolean);

//             // Missing — fallback
//             const missing = products.filter((p) => !sortedIds.includes(p.id));
//             setAiSorted([...sortedProducts, ...missing]);
//         } catch (err) {
//             console.error("AI Sort Error:", err);
//         } finally {
//             setAiSortLoading(false);
//         }
//     };

//     /* -------------------- AI TAG GENERATION -------------------- */
//     const generateTags = async (product) => {
//         setTagProduct(product);
//         setAiTagLoading(true);
//         setAiTags([]);

//         try {
//             const res = await axios.post("/api/ai/tags", {
//                 name: product.name,
//                 description: product.description || "",
//             });

//             setAiTags(res.data.tags || []);
//         } catch (err) {
//             console.error("AI Tags Error:", err);
//         } finally {
//             setAiTagLoading(false);
//         }
//     };

//     /* -------------------- AI DESCRIPTION -------------------- */
//     const generateDescription = async (product) => {
//         setDescProduct(product);
//         setAiDescLoading(true);
//         setAiDescription("");

//         try {
//             const res = await axios.post("/api/ai/describe", {
//                 name: product.name,
//                 baseDescription: product.description || "",
//             });

//             setAiDescription(res.data.description || "");
//         } catch (err) {
//             console.error("AI Desc Error:", err);
//         } finally {
//             setAiDescLoading(false);
//         }
//     };

//     /* -------------------- AI CHAT -------------------- */
//     const sendChat = async (e) => {
//         e.preventDefault();
//         if (!chatInput.trim()) return;

//         const newUserMsg = { role: "user", content: chatInput.trim() };

//         const updated = [...chatMessages, newUserMsg];
//         setChatMessages(updated);
//         setChatInput("");
//         setChatLoading(true);

//         try {
//             const res = await axios.post("/api/ai/chat", {
//                 message: newUserMsg.content,
//                 history: updated,
//             });

//             const reply = {
//                 role: "assistant",
//                 content: res.data.reply,
//             };

//             setChatMessages((prev) => [...prev, reply]);
//         } catch (err) {
//             console.error("AI Chat Error:", err);
//         } finally {
//             setChatLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-white text-gray-900 px-6 pt-12 pb-20">

//             {/* -------------------- PAGE HERO -------------------- */}
//             <div className="text-center">
//                 <motion.h1
//                     initial={{ opacity: 0, y: 15 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="text-5xl font-semibold"
//                 >
//                     ShopNest AI
//                 </motion.h1>

//                 <p className="text-gray-600 mt-2 text-lg">
//                     Search smarter. Explore deeper. Powered by Gemini.
//                 </p>
//             </div>

//             {/* -------------------- SEARCH BAR -------------------- */}
//             <form
//                 onSubmit={handleSearch}
//                 className="max-w-2xl mx-auto mt-10 flex gap-3"
//             >
//                 <input
//                     className="flex-1 border border-gray-300 px-5 py-3 rounded-full text-sm focus:ring-2 focus:ring-black/70"
//                     placeholder="Search anything (ex: budget smartphone, red shoes)…"
//                     value={aiSearchQuery}
//                     onChange={(e) => setAiSearchQuery(e.target.value)}
//                 />
//                 <button
//                     type="submit"
//                     className="bg-black text-white px-8 py-3 rounded-full text-sm"
//                     disabled={aiSearchLoading}
//                 >
//                     {aiSearchLoading ? "…" : "AI"}
//                 </button>
//             </form>

//             {/* -------------------- SEARCH RESULTS -------------------- */}
//             {searchProducts.length > 0 && (
//                 <section>
//                     <h2 className="text-3xl font-semibold mt-16 mb-8 text-center">
//                         AI Search Results
//                     </h2>
//                     <ProductGrid list={searchProducts} />
//                 </section>
//             )}

//             {/* -------------------- SORT BUTTON -------------------- */}
//             <div className="text-center mt-20">
//                 <button
//                     onClick={handleSort}
//                     disabled={aiSortLoading}
//                     className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-100 text-sm"
//                 >
//                     {aiSortLoading ? "Sorting…" : "AI Sort Products"}
//                 </button>
//             </div>

//             {aiSorted.length > 0 && (
//                 <section>
//                     <h2 className="text-3xl font-semibold mt-12 mb-6 text-center">
//                         AI Sorted Products
//                     </h2>
//                     <ProductGrid list={aiSorted} />
//                 </section>
//             )}

//             {/* -------------------- TAG + DESCRIPTION DEMO -------------------- */}
//             <div className="mt-28 max-w-3xl mx-auto">
//                 <h3 className="text-center text-3xl font-semibold mb-10">
//                     AI Product Tools
//                 </h3>

//                 <p className="text-center text-gray-500">
//                     Pick any product and generate AI tags or a smart description.
//                 </p>

//                 <ProductGrid
//                     list={products.slice(0, 6)}
//                     onTag={generateTags}
//                     onDescribe={generateDescription}
//                 />
//             </div>

//             {/* TAG RESULTS */}
//             {tagProduct && (
//                 <div className="mt-10 p-6 border rounded-3xl">
//                     <h4 className="text-xl font-semibold mb-3">
//                         Tags for {tagProduct.name}
//                     </h4>
//                     {aiTagLoading ? (
//                         <p>Generating…</p>
//                     ) : (
//                         <div className="flex flex-wrap gap-3">
//                             {aiTags.map((tag, i) => (
//                                 <span
//                                     key={i}
//                                     className="px-3 py-1 bg-gray-100 rounded-full border text-xs"
//                                 >
//                                     {tag}
//                                 </span>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* DESCRIPTION RESULTS */}
//             {descProduct && (
//                 <div className="mt-10 p-6 border rounded-3xl">
//                     <h4 className="text-xl font-semibold mb-3">
//                         Description for {descProduct.name}
//                     </h4>
//                     {aiDescLoading ? (
//                         <p>Writing…</p>
//                     ) : (
//                         <p className="text-gray-800">{aiDescription}</p>
//                     )}
//                 </div>
//             )}

//             {/* -------------------- CHATBOT -------------------- */}
//             <ChatWidget
//                 open={chatOpen}
//                 setOpen={setChatOpen}
//                 messages={chatMessages}
//                 setInput={setChatInput}
//                 input={chatInput}
//                 loading={chatLoading}
//                 send={sendChat}
//             />
//         </div>
//     );
// }

// /* ------------------------------------------------------------
//     SUB-COMPONENT: GRID
// ------------------------------------------------------------ */
// function ProductGrid({ list, onTag, onDescribe }) {
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//             {list.map((product) => (
//                 <div key={product.id}>
//                     <ProductCard product={product} />

//                     {onTag && (
//                         <button
//                             onClick={() => onTag(product)}
//                             className="text-xs mt-3 px-3 py-1 border rounded-full"
//                         >
//                             Generate Tags
//                         </button>
//                     )}
//                     {onDescribe && (
//                         <button
//                             onClick={() => onDescribe(product)}
//                             className="ml-3 text-xs mt-3 px-3 py-1 border rounded-full"
//                         >
//                             Describe
//                         </button>
//                     )}
//                 </div>
//             ))}
//         </div>
//     );
// }

// /* ------------------------------------------------------------
//     SUB-COMPONENT: CHAT WIDGET
// ------------------------------------------------------------ */
// function ChatWidget({ open, setOpen, messages, input, setInput, loading, send }) {
//     return (
//         <div className="fixed bottom-6 right-6">
//             {open ? (
//                 <div className="w-80 h-96 bg-white border rounded-3xl shadow-lg flex flex-col">
//                     <div className="p-3 border-b flex justify-between">
//                         <span className="font-semibold text-sm">ShopNest AI</span>
//                         <button onClick={() => setOpen(false)}>✕</button>
//                     </div>

//                     <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
//                         {messages.map((m, i) => (
//                             <div key={i} className={m.role === "user" ? "text-right" : ""}>
//                                 <span
//                                     className={`inline-block px-3 py-2 rounded-2xl 
//                                     ${m.role === "user"
//                                             ? "bg-black text-white"
//                                             : "bg-gray-100"
//                                         }`}
//                                 >
//                                     {m.content}
//                                 </span>
//                             </div>
//                         ))}
//                         {loading && <p className="text-gray-400 text-[10px]">Thinking…</p>}
//                     </div>

//                     <form onSubmit={send} className="p-2 border-t flex gap-1">
//                         <input
//                             className="flex-1 border rounded-full px-3 py-2 text-xs"
//                             placeholder="Ask something..."
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                         />
//                         <button className="bg-black text-white px-4 rounded-full text-xs">
//                             ➤
//                         </button>
//                     </form>
//                 </div>
//             ) : (
//                 <button
//                     onClick={() => setOpen(true)}
//                     className="px-4 py-3 bg-black text-white rounded-full text-xs"
//                 >
//                     🤖 AI Assist
//                 </button>
//             )}
//         </div>
//     );
// }
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ProductCard from "../../components/customer/ProductCard";
import { useAuth } from "../../context/AuthContext";



export default function AiExplore() {
    const [products, setProducts] = useState([]);
    const [loaded, setLoaded] = useState(false);

    /* -------------------- AI STATES -------------------- */
    const [aiSearchQuery, setAiSearchQuery] = useState("");
    const [aiSearchResults, setAiSearchResults] = useState([]);
    const [aiSearchLoading, setAiSearchLoading] = useState(false);

    const [aiSorted, setAiSorted] = useState([]);
    const [aiSortLoading, setAiSortLoading] = useState(false);

    const [tagProduct, setTagProduct] = useState(null);
    const [aiTags, setAiTags] = useState([]);
    const [aiTagLoading, setAiTagLoading] = useState(false);

    const [descProduct, setDescProduct] = useState(null);
    const [aiDescription, setAiDescription] = useState("");
    const [aiDescLoading, setAiDescLoading] = useState(false);

    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);

    /* -------------------- VOICE SEARCH STATES -------------------- */
    const [isListening, setIsListening] = useState(false);
    const [voiceSupported] = useState(
        () =>
            typeof window !== "undefined" &&
            (window.SpeechRecognition || window.webkitSpeechRecognition)
    );

    /* -------------------- LOAD PRODUCTS -------------------- */
    const loadProducts = async () => {
        if (loaded) return;
        try {
            const res = await axios.get("/api/products");
            setProducts(res.data || []);
        } catch (err) {
            console.error("Failed to load products:", err);
        } finally {
            setLoaded(true);
        }
    };

    const productMap = useMemo(
        () => new Map(products.map((p) => [p.id, p])),
        [products]
    );

    /* -------------------- AI SEARCH -------------------- */
    const handleSearch = async (e) => {
        e?.preventDefault?.();
        if (!aiSearchQuery.trim()) return;

        await loadProducts();

        setAiSearchLoading(true);
        setAiSearchResults([]);

        try {
            const res = await axios.post("/api/ai/search", {
                query: aiSearchQuery,
                products,
            });

            setAiSearchResults(res.data.ids || []);
        } catch (err) {
            console.error("AI Search Error:", err);
        } finally {
            setAiSearchLoading(false);
        }
    };

    const searchProducts = aiSearchResults
        .map((id) => productMap.get(id))
        .filter(Boolean);

    /* -------------------- AI SORTING -------------------- */
    const handleSort = async () => {
        await loadProducts();
        setAiSortLoading(true);
        setAiSorted([]);

        try {
            const res = await axios.post("/api/ai/sort", {
                products,
                criteria: "Sort by best value for customer",
            });

            const sortedIds = res.data.ids || [];
            const sortedProducts = sortedIds
                .map((id) => productMap.get(id))
                .filter(Boolean);

            const missing = products.filter((p) => !sortedIds.includes(p.id));
            setAiSorted([...sortedProducts, ...missing]);
        } catch (err) {
            console.error("AI Sort Error:", err);
        } finally {
            setAiSortLoading(false);
        }
    };

    /* -------------------- AI TAG GENERATION -------------------- */
    const generateTags = async (product) => {
        setTagProduct(product);
        setAiTagLoading(true);
        setAiTags([]);

        try {
            const res = await axios.post("/api/ai/tags", {
                name: product.name,
                description: product.description || "",
            });

            setAiTags(res.data.tags || []);
        } catch (err) {
            console.error("AI Tags Error:", err);
        } finally {
            setAiTagLoading(false);
        }
    };

    /* -------------------- AI DESCRIPTION -------------------- */
    const generateDescription = async (product) => {
        setDescProduct(product);
        setAiDescLoading(true);
        setAiDescription("");

        try {
            const res = await axios.post("/api/ai/describe", {
                name: product.name,
                baseDescription: product.description || "",
            });

            setAiDescription(res.data.description || "");
        } catch (err) {
            console.error("AI Desc Error:", err);
        } finally {
            setAiDescLoading(false);
        }
    };

    /* -------------------- AI CHAT -------------------- */
    const { user } = useAuth();
    const username = user?.username || "";
    const sendChat = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const newUserMsg = { role: "user", content: chatInput.trim() };

        const updated = [...chatMessages, newUserMsg];
        setChatMessages(updated);
        setChatInput("");
        setChatLoading(true);

        try {
            const res = await axios.post("/api/ai/chat", {
                message: newUserMsg.content,
                history: updated,
                username,
            });

            const reply = {
                role: "assistant",
                content: res.data.reply,
            };

            setChatMessages((prev) => [...prev, reply]);
        } catch (err) {
            console.error("AI Chat Error:", err);
        } finally {
            setChatLoading(false);
        }
    };

    /* -------------------- VOICE SEARCH: SIRI STYLE -------------------- */
    const startVoiceInput = () => {
        if (!voiceSupported) {
            alert("Voice search is not supported in this browser.");
            return;
        }

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = "en-IN";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.start();
        setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setAiSearchQuery(transcript);

            // auto-run search shortly after capture
            setTimeout(() => handleSearch({ preventDefault: () => { } }), 300);

            setIsListening(false);
        };

        recognition.onerror = () => {
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 px-6 pt-12 pb-20">

            {/* -------------------- PAGE HERO -------------------- */}
            <div className="text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-semibold"
                >
                    ShopNest AI
                </motion.h1>

                <p className="text-gray-600 mt-2 text-lg">
                    Search smarter. Explore deeper. Powered by Gemini.
                </p>
            </div>

            {/* -------------------- SEARCH BAR + SIRI MIC -------------------- */}
            <form
                onSubmit={handleSearch}
                className="max-w-2xl mx-auto mt-10 flex gap-3 items-center"
            >
                <input
                    className="flex-1 border border-gray-300 px-5 py-3 rounded-full text-sm focus:ring-2 focus:ring-black/70"
                    placeholder="Search anything (ex: budget smartphone, red shoes)…"
                    value={aiSearchQuery}
                    onChange={(e) => setAiSearchQuery(e.target.value)}
                />

                {/* AI SEARCH BUTTON */}
                <button
                    type="submit"
                    className="bg-black text-white px-7 py-3 rounded-full text-sm"
                    disabled={aiSearchLoading}
                >
                    {aiSearchLoading ? "…" : "AI"}
                </button>

                {/* VOICE SEARCH MIC BUTTON */}
                <button
                    type="button"
                    onClick={startVoiceInput}
                    className="relative w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition"
                    title="Voice Search"
                >
                    🎤

                    {/* Siri Pulse Animation */}
                    {isListening && (
                        <span className="absolute inset-0 rounded-full animate-siriPulse bg-blue-500 opacity-40" />
                    )}
                </button>
            </form>

            {/* -------------------- MAIN CONTENT GRID -------------------- */}
            <div className="max-w-7xl mx-auto pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

                    {/* LEFT — AI MAIN CONTENT */}
                    <div className="lg:col-span-3 space-y-28">

                        {/* AI SEARCH RESULTS */}
                        {searchProducts.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-semibold mt-4 mb-8 text-center">
                                    AI Search Results
                                </h2>
                                <ProductGrid list={searchProducts} />
                            </section>
                        )}

                        {/* AI SORT */}
                        <div className="text-center mt-10">
                            <button
                                onClick={handleSort}
                                disabled={aiSortLoading}
                                className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-100 text-sm disabled:opacity-60"
                            >
                                {aiSortLoading ? "Sorting…" : "AI Sort Products"}
                            </button>
                        </div>

                        {aiSorted.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-semibold mt-12 mb-6 text-center">
                                    AI Sorted Products
                                </h2>
                                <ProductGrid list={aiSorted} />
                            </section>
                        )}

                        {/* AI TOOLS SECTION */}
                        <div className="mt-20 max-w-3xl mx-auto">
                            <h3 className="text-center text-3xl font-semibold mb-6">
                                AI Product Tools
                            </h3>

                            <p className="text-center text-gray-500 mb-10">
                                Pick any product and let AI generate SEO tags or a clean description
                                based completely on ShopNest catalog.
                            </p>

                            <ProductGrid
                                list={products.slice(0, 6)}
                                onTag={generateTags}
                                onDescribe={generateDescription}
                            />
                        </div>

                        {/* TAG RESULTS */}
                        {tagProduct && (
                            <div className="mt-10 p-6 border rounded-3xl">
                                <h4 className="text-xl font-semibold mb-3">
                                    Tags for {tagProduct.name}
                                </h4>
                                {aiTagLoading ? (
                                    <p>Generating…</p>
                                ) : (
                                    <div className="flex flex-wrap gap-3">
                                        {aiTags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-gray-100 rounded-full border text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* DESCRIPTION RESULTS */}
                        {descProduct && (
                            <div className="mt-10 p-6 border rounded-3xl">
                                <h4 className="text-xl font-semibold mb-3">
                                    Description for {descProduct.name}
                                </h4>
                                {aiDescLoading ? (
                                    <p>Writing…</p>
                                ) : (
                                    <p className="text-gray-800">{aiDescription}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT — INFO / TIPS / PRESETS */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-sm sticky top-28 space-y-6">

                            {/* MAIN INFO */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                    What is ShopNest AI? 🤖
                                </h2>

                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    ShopNest AI uses{" "}
                                    <span className="font-medium text-black">
                                        store-restricted Gemini
                                    </span>{" "}
                                    to understand what you want and find products accordingly.
                                    All responses are based ONLY on ShopNest products & categories.
                                </p>

                                <ul className="text-sm text-gray-600 space-y-2 ml-1">
                                    <li>✔ AI-powered natural language search</li>
                                    <li>✔ AI ranking & sorting by value</li>
                                    <li>✔ Instant SEO tag generation</li>
                                    <li>✔ Clean product description rewrites</li>
                                    <li>✔ Chat-based shopping assistance</li>
                                </ul>
                            </div>

                            {/* USAGE TIPS */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                    AI Usage Tips 💡
                                </h3>
                                <ul className="text-xs text-gray-600 space-y-2 list-disc ml-4">
                                    <li>Use words like “budget”, “premium”, “best value”, “trending”.</li>
                                    <li>Include constraints like price, color, category, or purpose.</li>
                                    <li>Combine conditions: “red running shoes under ₹1500”.</li>
                                    <li>Use AI Sort when you want items ranked by usefulness.</li>
                                    <li>Ask the chat assistant to compare two products.</li>
                                </ul>
                            </div>

                            {/* PRESET POPULAR QUERIES */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                    Popular Searches 🔥
                                </h3>

                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "best headphones under ₹1500",
                                        "budget smartphones",
                                        "top trending watches",
                                        "lightweight running shoes",
                                        "gifts under ₹500",
                                        "best value laptop accessories",
                                        "eco-friendly products"
                                    ].map((query, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setAiSearchQuery(query)}
                                            className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition"
                                        >
                                            {query}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* -------------------- CHATBOT -------------------- */}
            <ChatWidget
                open={chatOpen}
                setOpen={setChatOpen}
                messages={chatMessages}
                setInput={setChatInput}
                input={chatInput}
                loading={chatLoading}
                send={sendChat}
            />
        </div>
    );
}

/* ------------------------------------------------------------
    SUB-COMPONENT: GRID
------------------------------------------------------------ */
function ProductGrid({ list, onTag, onDescribe }) {
    if (!list || list.length === 0) {
        return <p className="text-center text-gray-400 text-sm py-8">No products to show.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {list.map((product) => (
                <div key={product.id}>
                    <ProductCard product={product} />

                    {(onTag || onDescribe) && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {onTag && (
                                <button
                                    onClick={() => onTag(product)}
                                    className="text-xs px-3 py-1 border rounded-full hover:bg-gray-100"
                                >
                                    Generate Tags
                                </button>
                            )}
                            {onDescribe && (
                                <button
                                    onClick={() => onDescribe(product)}
                                    className="text-xs px-3 py-1 border rounded-full hover:bg-gray-100"
                                >
                                    Describe
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------
    SUB-COMPONENT: CHAT WIDGET
------------------------------------------------------------ */
function ChatWidget({ open, setOpen, messages, input, setInput, loading, send }) {
    const [isMaximized, setIsMaximized] = useState(false);

    /* 🧠 Auto-expand whenever a new message is added */
    useEffect(() => {
        if (messages.length > 0) {
            setIsMaximized(true); // Automatically maximize
        }
    }, [messages]);

    /* 🧠 Auto-expand when user starts typing */
    useEffect(() => {
        if (input.trim().length > 0) {
            setIsMaximized(true);
        }
    }, [input]);

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {open ? (
                <div
                    className={`
                        bg-white border rounded-3xl shadow-lg flex flex-col overflow-hidden 
                        transition-all duration-300
                        ${isMaximized ? "w-[450px] h-[600px]" : "w-80 h-96"}
                    `}
                >
                    {/* HEADER */}
                    <div className="p-3 border-b flex justify-between items-center">
                        <span className="font-semibold text-sm">ShopNest AI Assistant</span>

                        <div className="flex items-center gap-2">
                            {/* MAXIMIZE / RESTORE TOGGLE */}
                            <button
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="text-gray-500 hover:text-gray-800 text-xs"
                                title={isMaximized ? "Restore" : "Maximize"}
                            >
                                {isMaximized ? "⤡" : "⤢"}
                            </button>

                            {/* CLOSE */}
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-500 hover:text-gray-800 text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* MESSAGES */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs bg-gray-50">
                        {messages.length === 0 && (
                            <p className="text-gray-400 text-[11px]">
                                Ask things like “Suggest a phone under ₹15000” or
                                “Compare two smartwatches…”
                            </p>
                        )}

                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={m.role === "user" ? "text-right" : "text-left"}
                            >
                                <span
                                    className={`inline-block px-3 py-2 rounded-2xl max-w-[80%] ${m.role === "user"
                                            ? "bg-black text-white"
                                            : "bg-white border border-gray-200 text-gray-800"
                                        }`}
                                    style={{ whiteSpace: "pre-line" }}
                                >
                                    {m.content}
                                </span>
                            </div>
                        ))}

                        {loading && (
                            <p className="text-gray-400 text-[10px]">Thinking…</p>
                        )}
                    </div>

                    {/* INPUT BAR */}
                    <form onSubmit={send} className="p-2 border-t flex gap-1 bg-white">
                        <input
                            className="flex-1 border rounded-full px-3 py-2 text-xs 
                                       focus:outline-none focus:ring-1 focus:ring-black/70"
                            placeholder="Ask something…"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            className="bg-black text-white px-4 rounded-full text-xs"
                            disabled={loading}
                        >
                            ➤
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setOpen(true)}
                    className="px-4 py-3 bg-black text-white rounded-full text-xs shadow-xl"
                >
                    🤖 AI Assist
                </button>
            )}
        </div>
    );
}


