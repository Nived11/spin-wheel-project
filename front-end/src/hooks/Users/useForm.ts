import { useState } from "react";
import api from "../../utils/axios";

export const useForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [type, setType] = useState("birthday");
  const [link, setLink] = useState<string | null>(null);
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
      const res = await api.post("/create-uid", {
        name,
        phone,
        dobOrAnniversary,
      });

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

  return {
    name,
    setName,
    phone,
    setPhone,
    dob,
    setDob,
    type,
    setType,
    link,
    loading,
    error,
    showPopup,
    handleSubmit,
    closePopup,
  };
};
