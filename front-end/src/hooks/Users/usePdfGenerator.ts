import { useState } from "react";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

interface UserData {
  name: string;
  phone: string;
}

export const usePdfGenerator = () => {
  const [downloading, setDownloading] = useState(false);

  const generatePrizeCertificate = async (
    userData: UserData,
    prize: string,
    uid: string
  ) => {
    if (!userData || !uid) {
      toast.error("Coupon not ready. Please try again.", {
        duration: 2000,
        position: "top-center",
      });
      return;
    }

    setDownloading(true);

   try {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 25;
  const couponWidth = pageWidth - margin * 2;
  const couponHeight = 140;
  let y = (pageHeight - couponHeight) / 2;

  /* =======================
     Outer Border
  ======================= */
  pdf.setDrawColor(191, 145, 68); // Soft gold
  pdf.setLineWidth(1.2);
  pdf.rect(margin, y, couponWidth, couponHeight);

  /* =======================
     Header
  ======================= */
  pdf.setFillColor(235, 180, 90); // Warm gold
  pdf.rect(margin, y, couponWidth, 26, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(50, 35, 10);
  pdf.text("EMPIREPLAZA", pageWidth / 2, y + 16, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text("Thank you for dining with us", pageWidth / 2, y + 22, {
    align: "center",
  });

  y += 32;

  /* =======================
     Coupon Title
  ======================= */
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(120, 80, 20);
  pdf.text("REWARD COUPON", pageWidth / 2, y, { align: "center" });

  y += 10;

  pdf.setDrawColor(220, 180, 110);
  pdf.setLineWidth(0.6);
  pdf.line(margin + 10, y, pageWidth - margin - 10, y);

  y += 12;

  /* =======================
     Guest Details
  ======================= */
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(60, 60, 60);
  pdf.text("Guest Name", margin + 10, y);
  pdf.text("Phone", pageWidth / 2 + 5, y);

  y += 6;

  pdf.setFont("helvetica", "normal");
  pdf.text(userData.name || "N/A", margin + 10, y);
  pdf.text(userData.phone || "N/A", pageWidth / 2 + 5, y);

  y += 12;

  /* =======================
     Prize Section
  ======================= */
  pdf.setFillColor(255, 247, 230);
  pdf.roundedRect(margin + 10, y, couponWidth - 20, 26, 3, 3, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(150, 90, 20);
  pdf.text("You have received", pageWidth / 2, y + 10, {
    align: "center",
  });

  pdf.setFontSize(16);
  pdf.setTextColor(90, 50, 10);
  pdf.text(prize, pageWidth / 2, y + 20, { align: "center" });

  y += 36;

  /* =======================
     Redemption Code
  ======================= */
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(60, 60, 60);
  pdf.text("Redemption Code", margin + 10, y);

  y += 7;

  pdf.setFont("courier", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text(uid, margin + 10, y);

  y += 14;

  /* =======================
     Instructions
  ======================= */
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(9);
  pdf.setTextColor(120, 120, 120);
  pdf.text(
    "Please show this coupon to our staff to redeem your reward.",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  y += 8;

  pdf.text(
    "This coupon is valid for one-time use only and is non-transferable.",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  /* =======================
     Footer
  ======================= */
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    "© EmpirePlaza Restaurant · We look forward to serving you again",
    pageWidth / 2,
    y + 14,
    { align: "center" }
  );

  pdf.save(`Empire-Restaurant-Coupon-${uid}.pdf`);

  toast.success("Coupon downloaded successfully!", {
    duration: 2000,
    position: "top-center",
    icon: "✅",
  });

    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setDownloading(false);
    }
  };

  return { generatePrizeCertificate, downloading };
};
