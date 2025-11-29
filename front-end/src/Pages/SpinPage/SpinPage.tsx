import { useSpin } from "./hooks/useSpin";

const SpinPage = () => {
  const { loading, spinning, prize, handleSpin } = useSpin();

  if (loading) return <div>Validating link...</div>;

  return (
    <div>
      <h1>Spin Wheel</h1>
      {/* Replace this with real wheel later */}
      <button onClick={handleSpin} disabled={spinning || !!prize}>
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {prize && <p>You won: {prize}</p>}
    </div>
  );
};

export default SpinPage;
