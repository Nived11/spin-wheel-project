import { useState } from "react";
import toast from "react-hot-toast";
import { useSpin } from "../../hooks/Users/useSpin";
import { usePdfGenerator } from "../../hooks/Users/usePdfGenerator";
import SpinWheel from "../../components/SpinWheel";
import PrizePopup from "../../components/PrizePopup";
import { Loader2 } from "lucide-react";

const segments = [
  "Better Luck Next Time",
  "Pepsi 200ml",
  "5% OFF",
  "Watermelon Juice",
  "Gift",
  "10% OFF",
  "Free Full Mandi",
];

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-900 via-amber-950 to-slate-900 text-white">
        <Loader2 color="#facc15" size={50} className=" animate-spin " />
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
    
    // ✅ Start spinning immediately
    setIsSpinning(true);
    setIsFastSpinning(true);
    
    // ✅ Set fast continuous rotation (15 rotations in 3 seconds)
    const fastRotation = rotation + 360 * 15;
    setRotation(fastRotation);

    // Track timing for minimum 3 seconds
    const startTime = Date.now();
    const minSpinTime = 3000; // ✅ Reduced to 3 seconds

    // ✅ Call backend (wheel is already spinning)
    const result = await handleSpin();

    if (!result) {
      setRotation(rotation);
      setIsSpinning(false);
      setIsFastSpinning(false);
      setHasSpun(true);
      return;
    }

    setHasSpun(true);

    // ✅ Calculate remaining time
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, minSpinTime - elapsed);

    // Wait for minimum 3 seconds if API was faster
    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }

    // ✅ Stop fast spinning, start slow deceleration
    setIsFastSpinning(false);

    // Calculate exact landing position
    const index = segments.findIndex((s) => s === result);
    const sliceAngle = 360 / segments.length;
    const centerOfSlice = sliceAngle * index + sliceAngle / 2;
    const randomOffset = (Math.random() - 0.5) * (sliceAngle * 0.6);
    
    // Add 2 final slow spins + land on prize
    const finalRotation = fastRotation + (360 * 2) + (360 - centerOfSlice) + randomOffset;
    setRotation(finalRotation);

    // ✅ Show popup after 2 seconds slow animation
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-900 via-amber-950 to-slate-900 p-4 overflow-hidden">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-10 text-yellow-300 text-center drop-shadow-lg">
        Spin the Wheel!
      </h1>

      <SpinWheel
        rotation={rotation}
        isSpinning={isSpinning}
        isFastSpinning={isFastSpinning}
        hasSpun={hasSpun}
        onSpin={onSpinClick}
      />

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
