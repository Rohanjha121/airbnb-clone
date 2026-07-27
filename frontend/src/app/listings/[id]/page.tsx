import { use } from "react";
import Navbar from "@/components/navbar/Navbar";
import ListingDetailClient from "./ListingDetailClient";

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

export default function ListingPage({ params }: ListingPageProps) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
      <Navbar />
      <ListingDetailClient id={id} />
    </div>
  );
}
