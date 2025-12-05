const UsersPageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">

          <div className="bg-gray-50 border-b-2 border-gray-200">
            <div className="grid grid-cols-8 gap-2 px-4 py-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded animate-pulse"></div>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="grid grid-cols-8 gap-2 px-4 py-4 hover:bg-gray-50">
                {[...Array(8)].map((__, j) => (
                  <div
                    key={j}
                    className="h-5 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
          <div className="w-40 h-5 bg-gray-200 rounded animate-pulse"></div>

          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-10 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default UsersPageSkeleton;
