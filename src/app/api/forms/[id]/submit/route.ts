import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateDynamicAudit } from "@/lib/audit-evaluator";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const nested = body.business || {};
    const clientName = (body.clientName || nested.clientName || body.name || nested.name || "").trim();
    const locality = (body.locality || nested.locality || "").trim();
    const phone = (body.phone || nested.phone || body.whatsappNumber || nested.whatsappNumber || "").trim();
    const whatsappNumber = (body.whatsappNumber || nested.whatsappNumber || phone || "").trim();
    const answers = body.answers || {};

    if (!clientName) {
      return NextResponse.json(
        { success: false, error: "Full Name is required in Step 01." },
        { status: 400 }
      );
    }

    if (!locality) {
      return NextResponse.json(
        { success: false, error: "City / Locality is required in Step 01." },
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

    const formSettings = (form.settings as any) || {};
    const issuingBusinessName = (
      body.businessName ||
      nested.businessName ||
      formSettings.companyName ||
      form.title ||
      clientName
    ).trim();

    const category = form.category || body.category || nested.category || "Client Audit";

    // Save submission to database
    const saved = await prisma.businessAudit.create({
      data: {
        formId: form.id,
        userId: form.userId,
        slug: null,
        businessName: issuingBusinessName,
        clientName: clientName,
        category: category,
        locality: locality,
        phone: phone || null,
        whatsappNumber: whatsappNumber || null,
        mapsUrl: body.mapsUrl || nested.mapsUrl || null,
        auditorName: formSettings.companyName || "Client Self-Assessment",

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
      totalScore: evaluated.totalScore,
      maxScore: evaluated.maxScore,
      percentage: evaluated.percentage,
      bandTitle: evaluated.band.title,
      bandHeadline: evaluated.band.headline,
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
