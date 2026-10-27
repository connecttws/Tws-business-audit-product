import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();

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

    // If accessing for editing, verify ownership
    const isOwner = session && session.userId === form.userId;

    return NextResponse.json({
      success: true,
      form,
      isOwner: !!isOwner,
    });
  } catch (error: any) {
    console.error("Error retrieving form:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to retrieve form" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.auditForm.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Form not found" }, { status: 404 });
    }

    if (existing.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You do not own this form" },
        { status: 403 }
      );
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

    // Clean and validate slug if changed
    let cleanSlug = existing.slug;
    if (slug && slug !== existing.slug) {
      cleanSlug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const slugConflict = await prisma.auditForm.findFirst({
        where: { slug: cleanSlug, id: { not: id } },
      });
      if (slugConflict) {
        cleanSlug = `${cleanSlug}-${Math.random().toString(36).substring(2, 6)}`;
      }
    }

    // Compute total max score
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

    const updated = await prisma.auditForm.update({
      where: { id },
      data: {
        title: title ? title.trim() : existing.title,
        slug: cleanSlug,
        description: description !== undefined ? description?.trim() : existing.description,
        category: category !== undefined ? category?.trim() : existing.category,
        themeColor: themeColor || existing.themeColor,
        isPublished: isPublished !== undefined ? isPublished : existing.isPublished,
        sections: sections ? (sections as any) : existing.sections,
        questions: questions ? (questions as any) : existing.questions,
        scoreBands: scoreBands ? (scoreBands as any) : existing.scoreBands,
        settings: settings !== undefined ? (settings as any) : existing.settings,
        totalMaxScore: computedMaxScore,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Form updated successfully",
      form: updated,
    });
  } catch (error: any) {
    console.error("Error updating form:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update form" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.auditForm.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Form not found" }, { status: 404 });
    }

    if (existing.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You do not own this form" },
        { status: 403 }
      );
    }

    await prisma.auditForm.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Form deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting form:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete form" },
      { status: 500 }
    );
  }
}
