import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: "Audit ID is required" }, { status: 400 });
    }

    const audit = await prisma.businessAudit.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        form: {
          select: {
            title: true,
            themeColor: true,
            settings: true,
          },
        },
      },
    });

    if (!audit) {
      return NextResponse.json({ success: false, error: "Audit record not found" }, { status: 404 });
    }

    // Increment view count asynchronously
    prisma.businessAudit
      .update({
        where: { id: audit.id },
        data: {
          viewCount: { increment: 1 },
          lastViewedAt: new Date(),
        },
      })
      .catch((err) => console.error("Error updating viewCount:", err));

    return NextResponse.json({
      success: true,
      audit: {
        id: audit.id,
        businessName: audit.businessName,
        clientName: audit.clientName,
        category: audit.category,
        locality: audit.locality,
        phone: audit.phone,
        whatsappNumber: audit.whatsappNumber,
        mapsUrl: audit.mapsUrl,
        auditorName: audit.auditorName,
        totalScore: audit.totalScore,
        maxScore: audit.maxScore,
        percentage: audit.percentage,
        bandTitle: audit.bandTitle,
        bandHeadline: audit.bandHeadline,
        sprintDetails: audit.sprintDetails,
        sectionScores: audit.sectionScores,
        answers: audit.answers,
        findings: audit.findings,
        formSnapshot: audit.formSnapshot,
        formTitle: audit.form?.title,
        agencySettings: audit.form?.settings,
        status: audit.status,
        createdAt: audit.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error retrieving audit record:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to retrieve audit" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const data: any = {};
    if (body.status !== undefined) data.status = body.status;
    if (body.whatsappNumber !== undefined) data.whatsappNumber = body.whatsappNumber;

    const updated = await prisma.businessAudit.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      audit: updated,
    });
  } catch (error: any) {
    console.error("Error updating audit:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update audit" },
      { status: 500 }
    );
  }
}
