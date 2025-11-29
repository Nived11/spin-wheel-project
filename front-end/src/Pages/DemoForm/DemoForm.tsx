// src/Pages/DemoForm/DemoForm.tsx
import { useState } from "react";
import api from "../../api/axios";

const DemoForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLink(null);
    try {
      const res = await api.post("/create-uid", { name, phone, occasion });
      setLink(res.data.link);
    } catch (err: any) {
      const msg = err?.response?.data?.msg || "Failed to create link";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Empire Plaza Spin – Demo</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Phone: </label>
          <input value={phone} onChange={e => setPhone(e.target.value)} required />
        </div>
        <div>
          <label>Occasion: </label>
          <input value={occasion} onChange={e => setOccasion(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Spin Link"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {link && (
        <p>
          Spin link:{" "}
          <a href={link} target="_blank" rel="noreferrer">
            {link}
          </a>
        </p>
      )}
    </div>
  );
};

export default DemoForm;
