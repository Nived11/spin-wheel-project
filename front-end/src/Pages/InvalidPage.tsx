const InvalidPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-amber-900 via-amber-950 to-slate-900 text-white px-4">
      
      {/* Icon */}
      <div className="text-red-400 text-7xl mb-6 animate-bounce">
        ⚠️
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
        Invalid or Expired Link
      </h1>

      {/* Subtitle */}
      <p className="text-gray-300 text-center max-w-md mb-8 text-lg">
        The spin link you are trying to access is no longer valid.  
        Please check the link or request a new one.
      </p>

      {/* Button */}
      <a
        href="/"
        className="px-6 py-3 bg-linear-to-r from-yellow-400 to-orange-500 
                   text-slate-900 font-bold rounded-full text-lg shadow-lg 
                   hover:scale-110 active:scale-95 transition-transform"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default InvalidPage;
