import { Users, TrendingUp, Gift, CheckCircle } from "lucide-react";
import DashboardHomeSkeleton from "../../components/skeltons/DashboardHomeSkeleton";
import { useDashboardStats } from "../../hooks/Admin/useDashboardStats";

const DashboardHome = () => {
  const { stats, loading, error } = useDashboardStats();

  if (loading) return <DashboardHomeSkeleton />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards - Same for both roles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats?.totalUsers || 0}
              </h3>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Spins</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats?.totalSpins || 0}
              </h3>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Spins</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats?.pendingSpins || 0}
              </h3>
            </div>
            <Gift className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Redeemed</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats?.redeemedCount || 0}
              </h3>
            </div>
            <CheckCircle className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Prize Distribution - Same for both roles */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">Prize Distribution</h3>

        {stats?.prizeStats?.length > 0 ? (
          <div className="space-y-3">
            {stats.prizeStats.map((prize: any) => (
              <div
                key={prize._id}
                className="flex items-center justify-between border-b pb-2"
              >
                <span className="font-medium">{prize._id}</span>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {prize.count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No prize data available yet
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
