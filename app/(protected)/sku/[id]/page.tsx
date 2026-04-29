import { SkuDetailClient } from "@/components/sku/detail/SkuDetailClient";

export default async function SkuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SkuDetailClient skuId={id} />;
}
