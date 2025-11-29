import { useState } from "react";
import { useSpin } from "./hooks/useSpin";

const SpinPage = () => {
  const { loading, spinning, prize, handleSpin } = useSpin();
  const [rotation, setRotation] = useState(0);
      const segments = [
  "Free Full Mandi",
  "20% OFF",
  "10% OFF",
  "Free Lime Juice",
  "5% OFF",
  "Better Luck Next Time",
];

  if (loading) return <div>Validating link...</div>;

  const onSpinClick = async () => {
    if (spinning || prize) return;


    // call backend to get prize
    const result = await handleSpin(); // modify hook to return prize
    if (!result) return;

    const index = segments.findIndex((s) => s === result);
    const sliceAngle = 360 / segments.length;

    // make it spin 4 full turns, then land on chosen segment
    const randomOffset = Math.random() * sliceAngle;
    const target =
      360 * 4 + index * sliceAngle + randomOffset; // smooth slightly random stop

    setRotation(target);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Spin Wheel</h1>

      <div className="relative">
        {/* pointer */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-yellow-400" />

        {/* wheel */}
        <div
          className="w-72 h-72 rounded-full border-10 border-yellow-400 overflow-hidden transition-transform duration-4000 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* colored slices */}
          {segments.map((label, i) => (
            <div
              key={label}
              className="absolute w-1/2 h-1/2 origin-bottom-right"
              style={{
                transform: `rotate(${i * (360 / segments.length)}deg)`,
                backgroundColor: i % 2 === 0 ? "#F97316" : "#0EA5E9",
              }}
            >
              <div className="flex items-center justify-center h-full rotate-90 text-xs font-semibold">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onSpinClick}
        disabled={spinning || !!prize}
        className="mt-6 px-6 py-2 rounded-full bg-yellow-400 text-slate-900 font-bold disabled:bg-gray-400"
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>

      {prize && <p className="mt-4 text-lg">You won: {prize}</p>}
    </div>
  );
};

export default SpinPage;
