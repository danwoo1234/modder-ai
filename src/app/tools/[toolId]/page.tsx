import { tools } from "@/lib/tools";
import ToolPageClient from "./ToolPageClient";

export function generateStaticParams() {
  return tools.map((t) => ({ toolId: t.id }));
}

export default async function ToolPage({ params }: { params: Promise<{ toolId: string }> }) {
  const { toolId } = await params;
  return <ToolPageClient toolId={toolId} />;
}

