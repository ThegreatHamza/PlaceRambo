import ListingClient from "@/components/listing/listing-client";
import { getListing } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const l = getListing(id);
  return {
    title: l?.title || "Listing — PlaceRambo",
    description: l?.description || "Discover this listing on PlaceRambo, Djibouti's marketplace.",
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ListingClient id={id} />;
}
