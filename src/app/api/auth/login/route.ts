import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Issue session cookie
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      companyName: user.companyName,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Error during login:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to log in. Please try again.",
      },
      { status: 500 }
    );
  }
}
