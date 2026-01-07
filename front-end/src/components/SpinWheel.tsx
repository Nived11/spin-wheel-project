import { PRIZE_SEGMENTS } from "../constants/prizes";

// 🔹 REPLACE WITH YOUR REAL IMAGES
import iphone from "../assets/17.avif"
import earbud from "../assets/earbuds.png"
import mouse from "../assets/mouse.png"
import watch from "../assets/watch.png"
import powerbank from "../assets/powerbank.png"
import keyboard from "../assets/keyboard.png"
import tablet from "../assets/tablet.png"
import betterluck from "../assets/better.webp"
const placeholderImg = "https://cdn-icons-png.flaticon.com/512/6124/6124997.png"; 

const prizeImages: Record<string, string> = {
  "iPhone 17 Pro": iphone || placeholderImg,
  "Wireless Earbuds": earbud || placeholderImg,
  "Gaming Mouse": mouse || placeholderImg,
  "Smartwatch": watch || placeholderImg,
  "Power Bank": powerbank || placeholderImg,
  "Gaming Keyboard": keyboard || placeholderImg,
  "Tablet": tablet || placeholderImg,
  "Better Luck Next Time": betterluck,
};

interface SpinWheelProps {
  rotation: number;
  isSpinning: boolean;
  isFastSpinning: boolean;
  hasSpun: boolean;
  onSpin: () => void;
}

const segments = PRIZE_SEGMENTS;

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
  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
}

// ✅ HELPER: Splits long text into max 2 lines
const BreakText = ({ text, x, y, color }: { text: string; x: number; y: number; color: string }) => {
  const words = text.split(" ");
  let lines = [];
  
  if (words.length > 2 || text.length > 12) {
    // Split into 2 lines roughly in the middle
    const mid = Math.ceil(words.length / 2);
    lines = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  } else {
    lines = [text];
  }

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={lines.length > 1 ? 11 : 13} // Smaller font for 2 lines
      fontWeight="900"
      fill={color}
      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
    >
      {lines.map((line, index) => (
        <tspan key={index} x={x} dy={index === 0 ? 0 : 14}> {/* Move 2nd line down */}
          {line}
        </tspan>
      ))}
    </text>
  );
};

const SpinWheel = ({ rotation, isSpinning, isFastSpinning, hasSpun, onSpin }: SpinWheelProps) => {
  return (
    <div className="relative w-[320px] h-80 sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] flex items-center justify-center mb-4 sm:mb-8 overflow-visible">
      
      {/* Pointer */}
      <div className="absolute z-30 left-1/2 top-3 -translate-x-1/2 w-0 h-0 border-l-16 border-r-16 border-t-45 sm:border-l-20 sm:border-r-20 sm:top-5 sm:border-t-35 md:border-l-20 md:border-r-20 md:border-t-70 border-l-transparent border-r-transparent border-t-[#fda900ff] drop-shadow-2xl"/>

      <svg width="100%" height="100%" viewBox="0 0 500 500" className="drop-shadow-2xl"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isFastSpinning ? "transform 3s linear" : isSpinning ? "transform 2s cubic-bezier(0.33, 1, 0.68, 1)" : "none",
          willChange: isSpinning ? "transform" : "auto",
        }}
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFACD" /><stop offset="30%" stopColor="#FFD700" /><stop offset="60%" stopColor="#ffca1ed2" /><stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <radialGradient id="bulbGradient"><stop offset="0%" stopColor="#ffffffff" stopOpacity="0.8"/><stop offset="50%" stopColor="#f9ce50f0" stopOpacity="0.6"/><stop offset="100%" stopColor="#f39821ff" stopOpacity="0"/></radialGradient>
        </defs>

        <circle cx="250" cy="250" r="240" fill="none" stroke="#fda900ff" strokeWidth="20" />

        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
          const angle = i * 30 * (Math.PI / 180);
          const x = 250 + Math.cos(angle) * 240, y = 250 + Math.sin(angle) * 240;
          return <g key={i}><circle cx={x} cy={y} r="14" fill="url(#bulbGradient)" opacity="0.8" filter="url(#glow)"><animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.125}s`} /></circle><circle cx={x} cy={y} r="8" fill="#FFFACD" stroke="#ffd15dff" strokeWidth="2"><animate attributeName="fill" values="#FFFACD;#FFFFFF;#FFFACD" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.125}s`} /></circle><circle cx={x - 2} cy={y - 2} r="3" fill="#FFFFFF" opacity="0.9" /></g>;
        })}

        {segments.map((label, i) => {
          const isGold = i % 2 !== 0;
          const fillColor = isGold ? "url(#goldGradient)" : "#8B0000";
          const textColor = isGold ? "#8B0000" : "#FFFFFF";
          const angle = (360 / segments.length) * i + (360 / segments.length) / 2;

          return (
            <g key={i}>
              <path d={getArc(i, segments.length)} fill={fillColor} stroke="#B8860B" strokeWidth="2" />
              <g transform={`rotate(${angle}, 250, 250)`}>
                {/* ✅ Use Custom BreakText Component */}
                <BreakText text={label} x={250} y={85} color={textColor} />
                
                {/* Image */}
                <image
                  href={prizeImages[label] || placeholderImg}
                  x={250 - 20}
                  y={125} // Pushed image down slightly to make room for 2 lines
                  width="40"
                  height="40"
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>
            </g>
          );
        })}

        <circle cx="250" cy="250" r="45" fill="#8B0000" stroke="#fda900ff" strokeWidth="4" />
      </svg>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
        <div className="w-18 h-18 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-2 sm:p-5 md:p-3 bg-[#8B0000] shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center">
          <button onClick={onSpin} disabled={isSpinning} className={`w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_50%,#FFFACD,#FFD700,#B8860B)] border-[3px] border-[#FFFACD] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] flex items-center justify-center transition-transform duration-200 ${hasSpun ? "grayscale cursor-not-allowed" : "hover:scale-105 active:scale-95 cursor-pointer"}`}>
            <span className="text-[#8B0000] font-black uppercase text-sm sm:[1rem] md:text-[1rem] tracking-wider whitespace-nowrap drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]">SPIN</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
