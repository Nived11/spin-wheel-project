import { useState } from "react";
import api from "../../utils/axios";
import { Sparkles, Gift, Calendar, Phone, User, X, CheckCircle } from "lucide-react";

const DemoForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [type, setType] = useState("birthday");
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLink(null);

    try {
      const dobOrAnniversary = `${type}:${dob}`;
      const res = await api.post("/create-uid", { name, phone, dobOrAnniversary });
      setLink(res.data.link);
      setShowPopup(true);
    } catch (err: any) {
      const msg = err?.response?.data?.msg || "Failed to create link";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setLink(null);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-0 sm:p-4 md:p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-5 sm:p-8 w-full max-w-md relative overflow-hidden">

        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500 rounded-full blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-30 -z-10"></div>

        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="relative bg-linear-to-br from-amber-800 via-amber-900 to-slate-700  p-4 rounded-full shadow-lg mb-4 inline-block">
              <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Empire Plaza</h1>
          <p className="text-gray-600 font-medium flex items-center justify-center gap-2">
            <Gift className="w-4 h-4 text-amber-900" />
            Spin & Win Amazing Prizes!
          </p>
        </div>

        <div className="space-y-5">

          {error && (
            <div className="bg-red-50 border border-red-300 text-sm sm:text-base text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 text-amber-900" />
              Full Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={3}
              required
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl
                       focus:ring-1 focus:ring-amber-900 focus:border-amber-800
                       outline-none transition-all hover:border-gray-300"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4 text-amber-900" />
              Phone Number
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="\d{10}"
              maxLength={10}
              required
              placeholder="10 digit mobile number"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl
                       focus:ring-1 focus:ring-amber-900 focus:border-amber-800
                       outline-none transition-all hover:border-gray-300"
            />
          </div>

          {/* UPDATED: Mobile → stacked (1 col), Desktop → 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 whitespace-nowrap">
                <Gift className="w-4 h-4 text-amber-900" />
                Occasion
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl
                         focus:ring-1focus:ring-amber-900 focus:border-amber-800
                         outline-none transition-all hover:border-gray-300 bg-white"
              >
                <option value="birthday">🎂 Birthday</option>
                <option value="anniversary">💍 Anniversary</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 whitespace-nowrap">
                <Calendar className="w-4 h-4 text-amber-900" />
                Date
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl
                         focus:ring-1focus:ring-amber-900 focus:border-amber-800
                         outline-none transition-all hover:border-gray-300"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-linear-to-br from-amber-800 via-amber-900 to-slate-900  text-white py-2.5 rounded-xl 
                     hover:bg-blue-700 transition-all disabled:opacity-50 
                     font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] 
                     active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Spin Link
              </>
            )}
          </button>
        </div>
      </div>

      {showPopup && link && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-scaleIn">

            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">🎉 Link Generated!</h3>
              <p className="text-gray-600 mb-4">Your spin link is ready to share</p>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-medium underline hover:text-blue-800 break-all block transition-colors text-sm"
                >
                  {link}
                </a>
              </div>

              <div className="flex gap-3">
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-4 py-3 bg-linear-to-br from-amber-800 via-amber-900 to-slate-800 text-white rounded-lg font-semibold hover:bg-amber-900 transition-colors text-center cursor-pointer"
                >
                  Open Link
                </a>
                <button
                  onClick={closePopup}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      <style>{`
        
      `}</style>
    </div>
  );
};

export default DemoForm;
