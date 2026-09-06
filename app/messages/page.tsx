import { Suspense } from "react";
import MessagesClient from "@/components/messages/messages-client";

export const metadata = { title: "Messages — PlaceRambo" };

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="container py-10"><div className="skeleton h-[70vh]" /></div>}>
      <MessagesClient />
    </Suspense>
  );
}
