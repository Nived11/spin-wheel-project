import { useSpin } from "../hooks/useSpin";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

const segments = [
  "Free Full Mandi",
  "20% OFF",
  "10% OFF",
  "Free Lime Juice",
  "5% OFF",
  "Better Luck Next Time",
];

// Classic red and yellow alternating colors like in the image
const colors = ["#DC2626", "#FCD34D", "#DC2626", "#FCD34D", "#DC2626", "#FCD34D"];

function getArc(i: number, total: number) {
  const radius = 200, cx = 250, cy = 250;
  const angle = (360 / total) * i - 90;
  const angleNext = (360 / total) * (i + 1) - 90;
  const rad = (Math.PI / 180) * angle;
  const radNext = (Math.PI / 180) * angleNext;
  const x1 = cx + Math.cos(rad) * radius;
  const y1 = cy + Math.sin(rad) * radius;
  const x2 = cx + Math.cos(radNext) * radius;
  const y2 = cy + Math.sin(radNext) * radius;
  return `
    M ${cx} ${cy}
    L ${x1} ${y1}
    A ${radius} ${radius} 0 0 1 ${x2} ${y2}
    Z
  `;
}

const SpinPage = () => {
  const { loading, spinning, prize, handleSpin } = useSpin();
  const [rotation, setRotation] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  if (loading)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-amber-900 via-amber-950 to-slate-900 text-white">
      <ClipLoader color="#facc15" size={50} />  {/* Yellow theme spinner */}
      <p className="mt-4 text-lg">Validating link...</p>
    </div>
  );

  const onSpinClick = async () => {
    if (spinning || prize) return;

    // Pre-spin: start rotating to random position immediately
    setRotation(rotation + 360 * 2);

    // Wait a tiny bit for pre-spin to start
    await new Promise(resolve => setTimeout(resolve, 100));

    // Call backend
    const result = await handleSpin();
    if (!result) {
      setRotation(rotation);
      return;
    }

    // Calculate where to land
    const index = segments.findIndex((s) => s === result);
    const sliceAngle = 360 / segments.length;
    const randomOffset = Math.random() * (sliceAngle * 0.6) - (sliceAngle * 0.3);

    // Continue to final position
    const currentRot = rotation + 360 * 2;
    const finalRotation = currentRot + 360 * 3 + (360 - index * sliceAngle - sliceAngle / 2) + randomOffset;
    setRotation(finalRotation);

    setTimeout(() => {
      setShowPopup(true);
    }, 3500);
  };


  const isWinner = prize && prize !== "Better Luck Next Time";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-amber-900 via-amber-950 to-slate-900 p-4 overflow-hidden">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-10 text-yellow-300 text-center drop-shadow-lg">
        Spin the Wheel!
      </h1>

      {/* Wheel Container */}
      <div className="relative w-[320px] h-80 sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] flex items-center justify-center mb-4 sm:mb-8 overflow-visible">
        {/* Pointer at top center */}
        <div className="absolute z-30 left-1/2 top-3 -translate-x-1/2 w-0 h-0 
                        border-l-16 border-r-16 border-t-28
                        sm:border-l-20 sm:border-r-20 sm:top-5 sm:border-t-35
                        md:border-l-24 md:border-r-24 md:border-t-40
                        border-l-transparent border-r-transparent border-t-[#D97706] drop-shadow-2xl" />

        {/* Wheel SVG with border directly on it */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 500 500"
          className="drop-shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning || prize ? "transform 2.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none"
          }}
        >
          {/* Golden/Yellow border circle INSIDE SVG */}
          <circle
            cx="250"
            cy="250"
            r="240"
            fill="none"
            stroke="#D97706"
            strokeWidth="20"
          />

          {/* Small decorative circles on border (like in image) */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const x = 250 + Math.cos(angle) * 240;
            const y = 250 + Math.sin(angle) * 240;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="8"
                fill="#FCD34D"
                stroke="#92400E"
                strokeWidth="2"
              />
            );
          })}

          {/* Wheel segments */}
          {segments.map((label, i) => {
            // Determine text color based on background
            const textColor = i % 2 === 0 ? "#FCD34D" : "#DC2626"; // white for red, dark for yellow

            return (
              <g key={i}>
                <path
                  d={getArc(i, segments.length)}
                  fill={colors[i % colors.length]}
                  stroke="#78350F"
                  strokeWidth="3"
                />
                <text
                  x={250}
                  y={95}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={14}
                  fontWeight="900"
                  fill={textColor}
                  style={{ textShadow: "0 3px 6px rgba(0,0,0,0.5)" }}
                  transform={`rotate(${(360 / segments.length) * i + (360 / segments.length) / 2},250,250)`}
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Center circle decoration */}
          <circle cx="250" cy="250" r="35" fill="#92400E" />
          <circle cx="250" cy="250" r="25" fill="#DC2626" stroke="#FCD34D" strokeWidth="3" />
        </svg>

        {/* Center button - stays on top, doesn't rotate */}
        {/* Center button */}
        <button
          onClick={onSpinClick}
          disabled={spinning || !!prize}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
             w-20 h-20 sm:w-28 sm:h-28 md:w-30 md:h-30 
             text-lg sm:text-xl md:text-2xl
             rounded-full bg-linear-to-br from-yellow-400 via-yellow-300 to-yellow-500 
             text-slate-900 font-black shadow-2xl 
             disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed 
             z-20 border-3 md:border-4 border-amber-800 
             hover:scale-110 transition-transform active:scale-95"
        >
          SPIN
        </button>

      </div>

      {/* Popup Modal */}
      {showPopup && prize && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full text-center mx-4 shadow-2xl`}>
            {isWinner ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-green-600 mb-4">
                  Congratulations!
                </h2>
                <p className="text-xl text-gray-800 mb-2">You won:</p>
                <p className="text-2xl font-bold text-orange-600 mb-6">
                  {prize}
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😔</div>
                <h2 className="text-3xl font-bold text-gray-700 mb-4">
                  Oops!
                </h2>
                <p className="text-xl text-gray-800 mb-6">
                  Better Luck Next Time
                </p>
              </>
            )}
            <button
              onClick={() => setShowPopup(false)}
              className={`px-8 py-3 rounded-full font-bold text-white text-lg ${isWinner ? 'bg-linear-to-r from-green-500 to-emerald-600' : 'bg-linear-to-r from-gray-500 to-gray-600'
                } hover:shadow-lg transition-all`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinPage;
