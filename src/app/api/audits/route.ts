import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const formId = searchParams.get("formId")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";

    const where: any = {
      userId: session.userId,
    };

    if (formId) {
      where.formId = formId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: "insensitive" } },
        { locality: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { whatsappNumber: { contains: search, mode: "insensitive" } },
        { clientName: { contains: search, mode: "insensitive" } },
      ];
    }

    const records = await prisma.businessAudit.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        form: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      submissions: records.map((r) => ({
        id: r.id,
        businessName: r.businessName,
        clientName: r.clientName,
        category: r.category,
        locality: r.locality,
        phone: r.phone,
        whatsappNumber: r.whatsappNumber,
        totalScore: r.totalScore,
        maxScore: r.maxScore,
        percentage: r.percentage,
        bandTitle: r.bandTitle,
        status: r.status,
        formTitle: r.form.title,
        formSlug: r.form.slug,
        formId: r.form.id,
        viewCount: r.viewCount,
        createdAt: r.createdAt.toISOString(),
      })),
      total: records.length,
    });
  } catch (error: any) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to list submissions" },
      { status: 500 }
    );
  }
}
