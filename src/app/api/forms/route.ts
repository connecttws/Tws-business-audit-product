import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const forms = await prisma.auditForm.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        themeColor: true,
        isPublished: true,
        totalMaxScore: true,
        submissionCount: true,
        viewsCount: true,
        createdAt: true,
        updatedAt: true,
        sections: true,
        questions: true,
      },
    });

    return NextResponse.json({
      success: true,
      forms: forms.map((f) => ({
        ...f,
        questionCount: Array.isArray(f.questions) ? f.questions.length : 0,
        sectionCount: Array.isArray(f.sections) ? f.sections.length : 0,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch forms" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      description,
      category,
      themeColor,
      isPublished,
      sections,
      questions,
      scoreBands,
      settings,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Form title is required" },
        { status: 400 }
      );
    }

    // Clean and validate slug
    let cleanSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!cleanSlug) {
      cleanSlug = `audit-${Date.now().toString(36)}`;
    }

    // Ensure slug is unique
    const existing = await prisma.auditForm.findUnique({
      where: { slug: cleanSlug },
    });
    if (existing) {
      cleanSlug = `${cleanSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // Calculate total max score across all questions
    let computedMaxScore = 0;
    if (Array.isArray(questions)) {
      questions.forEach((q: any) => {
        if (Array.isArray(q.options)) {
          const maxOpt = Math.max(...q.options.map((o: any) => Number(o.points) || 0), 0);
          computedMaxScore += maxOpt;
        }
      });
    }

    if (computedMaxScore <= 0) computedMaxScore = 100;

    const newForm = await prisma.auditForm.create({
      data: {
        userId: session.userId,
        title: title.trim(),
        slug: cleanSlug,
        description: description?.trim() || null,
        category: category?.trim() || "Universal",
        themeColor: themeColor || "indigo",
        isPublished: isPublished !== false,
        sections: (sections || []) as any,
        questions: (questions || []) as any,
        scoreBands: (scoreBands || []) as any,
        settings: settings || null,
        totalMaxScore: computedMaxScore,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Form created successfully",
      form: newForm,
    });
  } catch (error: any) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create audit form" },
      { status: 500 }
    );
  }
}
