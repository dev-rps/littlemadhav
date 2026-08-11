import { NextResponse } from "next/server";

/**
 * GET /api/shipping/outbound-ip
 * Fetches the exact public egress IP address of the Node.js hosting server (Hostinger)
 * so it can be whitelisted in Shiprocket's API configuration panel (Settings > API > Configure).
 */
export async function GET() {
  try {
    const res = await fetch("https://api.ipify.org?format=json", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`IP lookup failed with status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      outboundIp: data.ip,
      message: "Use this IP address in Shiprocket Panel > Settings > API > Configure under IP Whitelist.",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    try {
      // Backup IP detection service if ipify is unreachable
      const resBackup = await fetch("https://ifconfig.me/ip", { cache: "no-store" });
      const ip = (await resBackup.text()).trim();
      return NextResponse.json({
        success: true,
        outboundIp: ip,
        message: "Use this IP address in Shiprocket Panel > Settings > API > Configure under IP Whitelist.",
        timestamp: new Date().toISOString(),
      });
    } catch (backupErr: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to detect server outbound IP address",
          details: err.message || backupErr.message,
        },
        { status: 500 }
      );
    }
  }
}
