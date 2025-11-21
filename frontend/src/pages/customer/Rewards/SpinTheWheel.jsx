import { useState } from "react";
import axios from "axios";
import { Wheel } from "react-custom-roulette";
import { Link } from "react-router-dom";

export default function SpinTheWheel() {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const data = [
        { option: "10 Points" },
        { option: "20 Points" },
        { option: "50 Points" },
        { option: "Better luck\nnext time" },
    ];

    const rewardMap = { 10: 0, 20: 1, 50: 2 };

    const spin = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const { data: resData } = await axios.post("/api/rewards/spin", {}, { withCredentials: true });
            const reward = resData.reward;

            let index;
            const rewardValue = Number(reward.value);
            if (reward.type === "points" && rewardMap[rewardValue] !== undefined) {
                index = rewardMap[rewardValue];
            } else {
                index = 3;
            }

            setPrizeNumber(index);
            setMustSpin(true);

            setTimeout(() => setResult(reward), 5000);
        } catch (err) {
            setError(err.response?.data?.message || "Spin failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex justify-center px-5 py-12 font-[system-ui]">
            <div className="w-full max-w-xl bg-white/60 backdrop-blur-2xl shadow-xl border border-gray-200 rounded-3xl p-8">

                {/* Back */}
                <Link to="/customer/rewards/">
                    <button className="text-blue-600 hover:text-blue-800 font-medium mb-4 text-sm">
                        ← Back to Rewards
                    </button>
                </Link>

                {/* Title */}
                <h2 className="text-4xl font-semibold text-gray-900 text-center mb-2 tracking-tight">
                    Spin the Wheel
                </h2>
                <p className="text-gray-500 text-center mb-8 text-sm">
                    Try your luck and earn bonus points!
                </p>

                {/* Wheel Card */}
                <div className="bg-white rounded-3xl shadow-md p-6 mb-8">
                    <div className="flex justify-center">
                        <Wheel
                            mustStartSpinning={mustSpin}
                            prizeNumber={prizeNumber}
                            data={data}
                            backgroundColors={["#c7d2fe", "#fbcfe8", "#fde68a", "#e5e7eb"]}
                            textColors={["#1f2937", "#1f2937", "#1f2937", "#1f2937"]}
                            onStopSpinning={() => setMustSpin(false)}
                        />
                    </div>
                </div>

                {/* Spin Button */}
                <button
                    onClick={spin}
                    disabled={loading || mustSpin}
                    className={`
                        w-full py-4 rounded-xl font-semibold text-white text-lg transition 
                        ${loading || mustSpin
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-md"}
                    `}
                >
                    {loading ? "Spinning…" : "Spin Now"}
                </button>

                {/* Error */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center">
                        {error}
                    </div>
                )}

                {/* Result */}
                {result && !error && (
                    <div className="mt-6 p-5 rounded-2xl bg-green-50 border border-green-200 shadow-sm text-center">
                        {result.type === "points" ? (
                            <>
                                <h3 className="text-2xl font-bold text-green-700">🎉 +{result.value} Points!</h3>
                                <p className="text-gray-600 mt-2 text-sm">Your reward has been added to your account.</p>
                            </>
                        ) : (
                            <h3 className="text-lg font-semibold text-gray-600">😢 Better luck next time!</h3>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
