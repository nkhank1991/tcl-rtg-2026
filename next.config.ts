import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "www.arsenal.com" },
      { protocol: "https", hostname: "aws-obg-image-lb-1.tcl.com" },
      { protocol: "https", hostname: "aws-obg-image-lb-2.tcl.com" },
      { protocol: "https", hostname: "aws-obg-image-lb-3.tcl.com" },
      { protocol: "https", hostname: "aws-obg-image-lb-4.tcl.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "biz-file.com" },
      { protocol: "https", hostname: "download.logo.wine" },
      { protocol: "https", hostname: "images.seeklogo.com" },
    ],
  },
};

export default nextConfig;
