import { Search, Trash2, CheckCircle, Clock, ChevronLeft, ChevronRight, XCircle, Pencil,} from "lucide-react";
import { useState } from "react";
import UsersPageSkeleton from "../../components/skeltons/UsersPageSkeleton";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useUsers } from "../../hooks/Admin/useUsers";

const UsersPage = () => {
  const {
    users,
    pagination,
    loading,
    error,
    search,
    setSearch,
    handleclearSearch,
    setCurrentPage,
    handleSearch,
    handleRedeem,
    handleDelete,
    actionLoading,
  } = useUsers();

  // Modal states
  const [redeemModal, setRedeemModal] = useState<{ open: boolean; uid: string | null }>({
    open: false,
    uid: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; uid: string | null }>({
    open: false,
    uid: null,
  });

  const formatDobOrAnniversary = (dobOrAnniversary: string) => {
    const [type, date] = dobOrAnniversary.split(":");
    return `${type === "birthday" ? "🎂" : "💍"} ${new Date(date).toLocaleDateString("en-IN")}`;
  };

 const confirmRedeem = async () => {
  if (redeemModal.uid) {
    await handleRedeem(redeemModal.uid);
    setRedeemModal({ open: false, uid: null }); 
  }
};

const confirmDelete = async () => {
  if (deleteModal.uid) {
    await handleDelete(deleteModal.uid);
    setDeleteModal({ open: false, uid: null }); 
  }
};

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-3"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by UID, Name, or Phone..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <button className="px-6 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700">
            Search
          </button>

          {search && (
            <button
              type="button"
              onClick={handleclearSearch}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <UsersPageSkeleton />
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">UID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">DOB/Anniv.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Prize</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Redeem</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Delete</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const isBLNT = user.prize?.toLowerCase() === "better luck next time";

                    return (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-blue-600 whitespace-nowrap">
                          {user.uid}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">{user.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{user.phone}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {formatDobOrAnniversary(user.dobOrAnniversary)}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-700 whitespace-nowrap">
                          {!user.hasSpun ? "—" : isBLNT ? "Better Luck Next Time" : user.prize}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {!user.hasSpun ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          ) : isBLNT ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                              <XCircle className="w-3 h-3" />
                              No Prize
                            </span>
                          ) : user.redeemed ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              <CheckCircle className="w-3 h-3" />
                              Redeemed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {!user.hasSpun || isBLNT ? (
                            "—"
                          ) : user.redeemed ? (
                            <span className="inline-flex items-center gap-1 text-green-700 text-sm font-semibold">
                              <CheckCircle className="w-4 h-4" />
                              Done
                            </span>
                          ) : (
                            <button
                              onClick={() => setRedeemModal({ open: true, uid: user.uid })}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Pencil className="w-3 h-3" />
                              Redeem
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setDeleteModal({ open: true, uid: user.uid })}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
              <p className="text-sm text-gray-600">
                Showing {users.length} of {pagination.totalUsers} users
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-4 py-1 bg-amber-600 text-white rounded-lg font-semibold">
                  {pagination.currentPage}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage}
                  className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={redeemModal.open}
        onClose={() => setRedeemModal({ open: false, uid: null })}
        onConfirm={confirmRedeem}
        title="Confirm Redemption"
        message="Are you sure you want to mark this prize as redeemed? This action confirms that the user has claimed their reward."
        confirmText="Mark as Redeemed"
        type="info"
        loading={actionLoading}
      />

      <ConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, uid: null })}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This will permanently remove the user and all their data. This action cannot be undone."
        confirmText="Delete User"
        type="danger"
        loading={actionLoading}
      />
    </div>
  );
};

export default UsersPage;
