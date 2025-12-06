import { Request, Response } from "express";
import User from "../models/User";
import Spin from "../models/Spin";

// Get users for redemption (same data, just different frontend display)
export const getUsersForRedemption = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;
    const search = req.query.search as string || "";

    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { uid: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      };
    }

    const totalUsers = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Return same data as superadmin, frontend will decide what to show
    const usersWithSpins = await Promise.all(
      users.map(async (user) => {
        const spin = await Spin.findOne({ uid: user.uid });
        return {
          _id: user._id,
          uid: user.uid,
          name: user.name,
          phone: user.phone, // Include but frontend won't show
          dobOrAnniversary: user.dobOrAnniversary, // Include but frontend won't show
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
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all users (super admin - same endpoint)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;
    const search = req.query.search as string || "";

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

    const totalUsers = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalUsers / limit);

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
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get full stats (both admin and superadmin see same data)
export const getFullStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSpins = await Spin.countDocuments();
    const pendingSpins = totalUsers - totalSpins;

    const prizeStats = await Spin.aggregate([
      {
        $group: {
          _id: "$prize",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
          _id: 1,
        },
      },
    ]);

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

// Mark prize as redeemed (both admin and superadmin)
export const markRedeemed = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;

    const spin = await Spin.findOne({ uid });
    if (!spin) return res.status(404).json({ msg: "Spin not found" });

    if (spin.redeemed) {
      return res.status(400).json({ msg: "Already redeemed" });
    }

    spin.redeemed = true;
    spin.redemptionTime = new Date();
    await spin.save();

    res.json({ msg: "Marked as redeemed", spin });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete user (super admin only)
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
