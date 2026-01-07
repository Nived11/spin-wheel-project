import { Download } from "lucide-react";
import { type Prize } from "../constants/prizes";

interface PrizePopupProps {
  prize: Prize;
  uid: string;
  isWinner: boolean;
  downloading: boolean;
  onClose: () => void;
  onDownload: () => void;
}

const PrizePopup = ({
  prize,
  uid,
  isWinner,
  downloading,
  onClose,
  onDownload,
}: PrizePopupProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="bg-gradient-to-br from-red-900 to-red-950 p-8 rounded-2xl shadow-2xl max-w-md w-full border-4 border-yellow-500">

        {/* Title */}
        <h2 className="text-3xl font-bold text-yellow-300 mb-4 text-center">
          {isWinner ? "🎉 Congratulations!" : "😔 Oh No!"}
        </h2>

        {/* Prize */}
        <p className="text-xl text-white text-center mb-6">
          {isWinner ? (
            <>
              You won:{" "}
              <span className="font-bold text-yellow-300">{prize}</span>
            </>
          ) : (
            "Better Luck Next Time"
          )}
        </p>

        {/* UID / Redemption Code */}
        {isWinner && uid && (
          <div className="bg-black bg-opacity-30 border-2 border-yellow-400 rounded-xl p-4 mb-5 text-center">
            <p className="text-sm text-yellow-200 mb-1">
              Your Redemption Code
            </p>
            <p className="text-2xl font-mono font-bold text-yellow-300">
              {uid}
            </p>
          </div>
        )}

        {/* Download Button */}
        {isWinner && (
          <button
            onClick={onDownload}
            disabled={downloading}
            className="w-full mb-4 bg-yellow-500 hover:bg-yellow-600
              text-slate-900 font-bold py-3 px-6 rounded-lg
              flex items-center justify-center gap-2 transition
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download size={20} />
            {downloading ? "Downloading..." : "Download Coupon"}
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-transparent border-2 border-yellow-500
            hover:bg-yellow-800 hover:text-white
            text-yellow-300 font-bold py-3 px-6 rounded-lg transition cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PrizePopup;
