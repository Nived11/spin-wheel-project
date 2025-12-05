import { Request, Response } from "express";
import User from "../models/User";
import Spin from "../models/Spin";

// Get all users with their spin status (with pagination and search)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;
    
    // Search filters
    const search = req.query.search as string || "";
    
    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { uid: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalUsers / limit);

    // Get users with pagination
    const users = await User.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const usersWithSpins = await Promise.all(
      users.map(async (user) => {
        const spin = await Spin.findOne({ uid: user.uid });
        return {
          _id: user._id,
          uid: user.uid,
          name: user.name,
          phone: user.phone,
          dobOrAnniversary: user.dobOrAnniversary,
          createdAt: user.createdAt,
          hasSpun: !!spin,
          prize: spin?.prize || null,
          spinTime: spin?.spinTime || null,
          redeemed: spin?.redeemed || false,
          redemptionTime: spin?.redemptionTime || null,
        };
      })
    );

    res.json({ 
      users: usersWithSpins,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get dashboard statistics
// Get dashboard statistics
export const getStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSpins = await Spin.countDocuments();
    const pendingSpins = totalUsers - totalSpins;

    // Prize distribution with stable sorting
    const prizeStats = await Spin.aggregate([
      {
        $group: {
          _id: "$prize",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { 
          count: -1,  // Primary: Sort by count (highest first)
          _id: 1      // Secondary: Sort alphabetically (A-Z) for same counts
        }
      }
    ]);

    // Redemption stats
    const redeemedCount = await Spin.countDocuments({ redeemed: true });
    const pendingRedemption = totalSpins - redeemedCount;

    res.json({
      totalUsers,
      totalSpins,
      pendingSpins,
      prizeStats,
      redeemedCount,
      pendingRedemption,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};


// Mark prize as redeemed
export const markRedeemed = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;

    const spin = await Spin.findOne({ uid });
    if (!spin) return res.status(404).json({ msg: "Spin not found" });

    spin.redeemed = true;
    spin.redemptionTime = new Date();
    await spin.save();

    res.json({ msg: "Marked as redeemed", spin });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete a user (and their spin if exists)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    await User.deleteOne({ uid });
    await Spin.deleteOne({ uid });

    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
