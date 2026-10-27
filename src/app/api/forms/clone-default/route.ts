import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { DEFAULT_TEMPLATE } from "@/lib/default-template";

export async function POST() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Generate unique slug
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const slug = `tws-audit-${randomSuffix}`;

    const newForm = await prisma.auditForm.create({
      data: {
        userId: session.userId,
        title: DEFAULT_TEMPLATE.title,
        slug,
        description: DEFAULT_TEMPLATE.description,
        category: DEFAULT_TEMPLATE.category,
        themeColor: DEFAULT_TEMPLATE.themeColor,
        isPublished: true,
        sections: DEFAULT_TEMPLATE.sections as any,
        questions: DEFAULT_TEMPLATE.questions as any,
        scoreBands: DEFAULT_TEMPLATE.scoreBands as any,
        settings: {
          ...DEFAULT_TEMPLATE.settings,
          companyName: session.companyName || session.name || "Team TWS",
        } as any,
        totalMaxScore: DEFAULT_TEMPLATE.totalMaxScore || 100,
      },
    });

    return NextResponse.json({
      success: true,
      message: "TWS 5-Pillar Default Audit cloned successfully!",
      form: newForm,
    });
  } catch (error: any) {
    console.error("Error cloning default form:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to clone template" },
      { status: 500 }
    );
  }
}
