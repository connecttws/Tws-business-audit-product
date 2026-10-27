import { redirect } from "next/navigation";

export default async function ShortReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/report?id=${id}`);
}
