interface SpinWheelProps {
  rotation: number;
  isSpinning: boolean;
  isFastSpinning: boolean;
  hasSpun: boolean;
  onSpin: () => void;
}

const segments = [
  "Better Luck Next Time",
  "Pepsi 200ml",
  "5% OFF",
  "Watermelon Juice",
  "Gift",
  "10% OFF",
  "Free Full Mandi",
];

const colors = [
  "#DC2626",
  "#FCD34D",
  "#DC2626",
  "#FCD34D",
  "#DC2626",
  "#FCD34D",
  "#DC2626",
];

function getArc(i: number, total: number) {
  const radius = 200,
    cx = 250,
    cy = 250;
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

const SpinWheel = ({ rotation, isSpinning, isFastSpinning, hasSpun, onSpin }: SpinWheelProps) => {
  return (
    <div className="relative w-[320px] h-80 sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] flex items-center justify-center mb-4 sm:mb-8 overflow-visible">
      {/* Pointer */}
      <div
        className="absolute z-30 left-1/2 top-3 -translate-x-1/2 w-0 h-0 
                      border-l-16 border-r-16 border-t-28
                      sm:border-l-20 sm:border-r-20 sm:top-5 sm:border-t-35
                      md:border-l-24 md:border-r-24 md:border-t-40
                      border-l-transparent border-r-transparent border-t-[#D97706] drop-shadow-2xl"
      />

      {/* Wheel SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 500"
        className="drop-shadow-2xl"
        style={{
          transform: `rotate(${rotation}deg)`,
          // ✅ Faster timings: 3s fast spin, 2s slow down
          transition: isFastSpinning
            ? "transform 3s linear" // ✅ 3 seconds fast spin
            : isSpinning
            ? "transform 2s cubic-bezier(0.33, 1, 0.68, 1)" // ✅ 2 seconds slow down
            : "none",
          willChange: isSpinning ? "transform" : "auto",
        }}
      >
        <circle
          cx="250"
          cy="250"
          r="240"
          fill="none"
          stroke="#D97706"
          strokeWidth="20"
        />

        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
          const angle = i * 30 * (Math.PI / 180);
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

        {segments.map((label, i) => {
          const textColor = i % 2 === 0 ? "#FCD34D" : "#DC2626";
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
                fontSize={label.length > 15 ? 12 : 14}
                fontWeight="900"
                fill={textColor}
                style={{ textShadow: "0 3px 6px rgba(0,0,0,0.5)" }}
                transform={`rotate(${
                  (360 / segments.length) * i + 360 / segments.length / 2
                },250,250)`}
              >
                {label}
              </text>
            </g>
          );
        })}

        <circle cx="250" cy="250" r="35" fill="#92400E" />
        <circle
          cx="250"
          cy="250"
          r="25"
          fill="#DC2626"
          stroke="#FCD34D"
          strokeWidth="3"
        />
      </svg>

      {/* Spin Button */}
      <button
        onClick={onSpin}
        disabled={isSpinning}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
           w-20 h-20 sm:w-28 sm:h-28 md:w-30 md:h-30 text-lg sm:text-xl md:text-2xl
           rounded-full bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 
           text-slate-900 font-black shadow-2xl z-20 border-3 md:border-4 border-amber-800 
           transition-transform active:scale-95
           ${hasSpun ? "cursor-not-allowed" : "hover:scale-110 cursor-pointer"}
           ${isSpinning ? "opacity-70" : ""}`}
      >
        {isSpinning ? "" : "SPIN"}
      </button>
    </div>
  );
};

export default SpinWheel;
