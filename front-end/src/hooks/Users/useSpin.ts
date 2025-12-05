import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/axios"; 
import toast from "react-hot-toast";


export const useSpin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);

  // validate UID on first load

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
    return p; // important for wheel animation
  } catch (e) {
    toast.error("Something went wrong or you already spin.");
    return null;
  } finally {
    setSpinning(false);
  }
};


  return { loading, spinning, prize, handleSpin };
};
