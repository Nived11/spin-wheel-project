import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";

interface UserData {
  name: string;
  phone: string;
}

export const useSpin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [uid, setUid] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);

  useEffect(() => {
    const qUid = searchParams.get("uid");
    if (!qUid) {
      navigate("/invalid");
      return;
    }
    setUid(qUid);

    const validate = async () => {
      try {
        const res = await api.get("/validate-uid", { params: { uid: qUid } });
        if (!res.data.valid) {
          navigate("/invalid");
          return;
        }

        // Fetch user details
        const userRes = await api.get("/user-details", { params: { uid: qUid } });
        setUserData(userRes.data);

        setLoading(false);
      } catch {
        navigate("/invalid");
      }
    };

    validate();
  }, [searchParams, navigate]);

  const handleSpin = async () => {
    if (!uid || spinning || prize) return null;
    setSpinning(true);
    try {
      const res = await api.post("/spin", { uid });
      const p = res.data.prize as string;
      setPrize(p);
      return p;
    } catch (e: any) {
      const errorMsg =
        e?.response?.data?.msg || e?.message || "Something went wrong";

      if (errorMsg.toLowerCase().includes("already")) {
        toast.error("You have already spun the wheel!", {
          duration: 3000,
          position: "top-center",
        });
      } else {
        toast.error(errorMsg, {
          duration: 3000,
          position: "top-center",
        });
      }
      return null;
    } finally {
      setSpinning(false);
    }
  };

  return {
    loading,
    spinning,
    prize,
    handleSpin,
    uid,
    userData,
  };
};
