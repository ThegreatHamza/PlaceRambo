import SellerClient from "@/components/seller/seller-client";
import { getSeller } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = getSeller(id);
  return {
    title: `${s.name} — Seller profile | PlaceRambo`,
    description: s.bio,
  };
}

export default async function SellerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SellerClient id={id} />;
}
