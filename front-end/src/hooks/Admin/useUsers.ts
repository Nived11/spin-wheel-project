import { useState, useEffect, useRef } from "react";
import api from "../../utils/axios";
import { toast } from "react-hot-toast";
import { extractErrorMessages } from "../../utils/extractErrorMessages";

export interface User {
  _id: string;
  uid: string;
  name: string;
  phone: string;
  dobOrAnniversary: string;
  createdAt: string;
  hasSpun: boolean;
  prize: string | null;
  spinTime: string | null;
  redeemed: boolean;
  redemptionTime: string | null;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  
  const hasFetchedRef = useRef(false);
  const currentSearchRef = useRef("");
  const currentPageRef = useRef(1);

  const fetchUsers = async (page = 1, searchQuery = "", forceRefetch = false) => {
    const cacheKey = `${page}-${searchQuery}`;
    const currentCache = `${currentPageRef.current}-${currentSearchRef.current}`;
    
    // Skip if already loaded same data
    if (hasFetchedRef.current && cacheKey === currentCache && !forceRefetch) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/admin/users?page=${page}&search=${searchQuery}`);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
      
      hasFetchedRef.current = true;
      currentSearchRef.current = searchQuery;
      currentPageRef.current = page;

      if (res.data.users.length === 0 && searchQuery) {
        toast.error("No users found for your search");
      }
    } catch (err: any) {
      console.error("Fetch failed:", err);
      setError(extractErrorMessages(err));
      if (search) toast.error(extractErrorMessages(err) || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleclearSearch = () => {
    setSearch("");
    setCurrentPage(1);
    fetchUsers(1, "", true);
  };

  useEffect(() => {
    fetchUsers(currentPage, search);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1, search, true);
  };

  const handleRedeem = async (uid: string) => {
    try {
      setActionLoading(true);
      
      // ✅ Optimistic update - instant UI feedback
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.uid === uid 
            ? { ...user, redeemed: true, redemptionTime: new Date().toISOString() } 
            : user
        )
      );

      await api.post("/admin/redeem", { uid });
      toast.success("Prize marked as redeemed");
    } catch (err: any) {
      // ❌ Revert on error
      fetchUsers(currentPage, search, true);
      toast.error(extractErrorMessages(err) || "Failed to redeem");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (uid: string) => {
    const previousUsers = [...users];
    try {
      setActionLoading(true);
      
      // ✅ Optimistic update - instant removal from UI
      setUsers(prevUsers => prevUsers.filter(user => user.uid !== uid));
      
      // Update pagination count
      if (pagination) {
        setPagination({
          ...pagination,
          totalUsers: pagination.totalUsers - 1
        });
      }

      await api.delete(`/admin/users/${uid}`);
      toast.success("User deleted successfully");
      
      // If page is now empty and not first page, go back
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (err: any) {
      // ❌ Revert on error
      setUsers(previousUsers);
      toast.error(extractErrorMessages(err) || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    users,
    pagination,
    loading,
    error,
    search,
    setSearch,
    handleclearSearch,
    currentPage,
    setCurrentPage,
    fetchUsers,
    handleSearch,
    handleRedeem,
    handleDelete,
    actionLoading,
  };
};
