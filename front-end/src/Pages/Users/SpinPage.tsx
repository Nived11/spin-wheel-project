import { useState } from "react";
import toast from "react-hot-toast";
import { useSpin } from "../../hooks/Users/useSpin";
import { usePdfGenerator } from "../../hooks/Users/usePdfGenerator";
import SpinWheel from "../../components/SpinWheel";
import PrizePopup from "../../components/PrizePopup";
import { Loader2 } from "lucide-react";
import { PRIZE_SEGMENTS } from "../../constants/prizes";

// ✅ Import ONLY the left gift box image
import giftBox from "../../assets/lftbox.png"; 

const segments = PRIZE_SEGMENTS;

const SpinPage = () => {
  const { loading, prize, handleSpin, uid, userData } = useSpin();
  const { generatePrizeCertificate, downloading } = usePdfGenerator();

  const [rotation, setRotation] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [isFastSpinning, setIsFastSpinning] = useState(false);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-900 via-red-950 to-slate-900 text-white">
        <Loader2 color="#FFD700" size={50} className="animate-spin" />
        <p className="mt-4 text-lg">Validating link...</p>
      </div>
    );

  const onSpinClick = async () => {
    if (hasSpun) {
      toast.error("You have already spin the wheel!", {
        duration: 3000,
        position: "top-center",
        style: { background: "#EF4444", color: "#fff", fontWeight: "bold" },
      });
      return;
    }

    if (isSpinning || prize) return;
    
    setIsSpinning(true);
    setIsFastSpinning(true);
    
    const fastRotation = rotation + 360 * 15;
    setRotation(fastRotation);

    const startTime = Date.now();
    const minSpinTime = 3000;

    const result = await handleSpin();

    if (!result) {
      setRotation(rotation);
      setIsSpinning(false);
      setIsFastSpinning(false);
      setHasSpun(true);
      return;
    }

    setHasSpun(true);

    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, minSpinTime - elapsed);

    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }

    setIsFastSpinning(false);

    const index = segments.findIndex((s) => s === result);
    const sliceAngle = 360 / segments.length;
    const centerOfSlice = sliceAngle * index + sliceAngle / 2;
    const randomOffset = (Math.random() - 0.5) * (sliceAngle * 0.6);
    
    const finalRotation = fastRotation + (360 * 2) + (360 - centerOfSlice) + randomOffset;
    setRotation(finalRotation);

    setTimeout(() => {
      setShowPopup(true);
      setIsSpinning(false);
    }, 2000);
  };

  const handleDownloadPrize = () => {
    if (userData && prize && uid) {
      generatePrizeCertificate(userData, prize, uid);
    }
  };

  const isWinner = prize && prize !== "Better Luck Next Time";

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-gradient-to-br from-red-950 via-red-900 to-red-950 p-4 overflow-hidden">
      
      {/* ✅ LEFT GIFT BOX (Visible on ALL screens) */}
      {/* Mobile: w-32 (smaller), Desktop: lg:w-64 (larger) */}
      <img 
        src={giftBox} 
        alt="Gifts Left" 
        className="absolute bottom-0 left-0 w-38 sm:w-40 lg:w-64 xl:w-80 opacity-90 drop-shadow-2xl z-10 pointer-events-none animate-bounce-slow"
      />

      {/* ✅ RIGHT GIFT BOX (Visible on ALL screens, FLIPPED) */}
      <img 
        src={giftBox} 
        alt="Gifts Right" 
        className="absolute bottom-0 right-0 w-38 sm:w-40 lg:w-64 xl:w-80 opacity-90 drop-shadow-2xl z-10 pointer-events-none animate-bounce-slow scale-x-[-1]"
      />

      <h1 className=" text-2xl sm:text-3xl md:text-4xl font-extrabold
        mb-6 sm:mb-10 text-center
        bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FFD700] to-[#B8860B]
        drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] z-20">
        Spin the Wheel!
      </h1>

      <div className="z-20 mb-16 sm:mb-0"> {/* Added mb-16 to prevent overlap on small mobiles */}
        <SpinWheel
          rotation={rotation}
          isSpinning={isSpinning}
          isFastSpinning={isFastSpinning}
          hasSpun={hasSpun}
          onSpin={onSpinClick}
        />
      </div>

      {showPopup && prize && uid && (
        <PrizePopup
          prize={prize}
          uid={uid}
          isWinner={!!isWinner}
          downloading={downloading}
          onClose={() => setShowPopup(false)}
          onDownload={handleDownloadPrize}
        />
      )}
    </div>
  );
};

export default SpinPage;
