import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateDynamicAudit, BusinessDetails } from "@/lib/audit-evaluator";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { business, answers } = body as {
      business: BusinessDetails;
      answers: Record<string, number>;
    };

    if (!business?.name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Business name is required" },
        { status: 400 }
      );
    }

    if (!business?.locality?.trim()) {
      return NextResponse.json(
        { success: false, error: "Locality / City is required" },
        { status: 400 }
      );
    }

    // Find form by ID or slug
    const form = await prisma.auditForm.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!form) {
      return NextResponse.json(
        { success: false, error: "Audit form not found" },
        { status: 404 }
      );
    }

    if (!form.isPublished) {
      return NextResponse.json(
        { success: false, error: "This audit form is currently not accepting submissions" },
        { status: 403 }
      );
    }

    // Evaluate dynamic score, section breakdowns, and diagnostic findings
    const evaluated = evaluateDynamicAudit(
      {
        sections: (form.sections as any) || [],
        questions: (form.questions as any) || [],
        scoreBands: (form.scoreBands as any) || [],
        totalMaxScore: form.totalMaxScore,
      },
      answers || {}
    );

    // Save submission to database
    const saved = await prisma.businessAudit.create({
      data: {
        formId: form.id,
        userId: form.userId,
        slug: null,
        businessName: business.name.trim(),
        clientName: business.clientName?.trim() || null,
        category: business.category || form.category || "Universal",
        locality: business.locality.trim(),
        phone: business.phone?.trim() || null,
        whatsappNumber: business.whatsappNumber?.trim() || business.phone?.trim() || null,
        mapsUrl: business.mapsUrl?.trim() || null,
        auditorName: business.auditorName?.trim() || "Online Audit",

        totalScore: evaluated.totalScore,
        maxScore: evaluated.maxScore,
        percentage: evaluated.percentage,
        bandTitle: evaluated.band.title,
        bandHeadline: evaluated.band.headline,
        sprintDetails: evaluated.band.sprintRecommendation,

        sectionScores: evaluated.sectionScores as any,
        answers: (answers || {}) as any,
        findings: evaluated.findings as any,
        formSnapshot: {
          title: form.title,
          category: form.category,
          themeColor: form.themeColor,
          sections: form.sections,
          questions: form.questions,
          scoreBands: form.scoreBands,
          settings: form.settings,
        } as any,

        status: "new",
      },
    });

    // Atomically increment submission count on form
    await prisma.auditForm.update({
      where: { id: form.id },
      data: {
        submissionCount: { increment: 1 },
      },
    }).catch((err) => console.error("Error incrementing form submissionCount:", err));

    const reportUrl = `/r/${saved.id}`;

    return NextResponse.json({
      success: true,
      auditId: saved.id,
      reportUrl,
      evaluated,
    });
  } catch (error: any) {
    console.error("Error processing audit submission:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to submit audit" },
      { status: 500 }
    );
  }
}
