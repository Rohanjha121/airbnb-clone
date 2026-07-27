import Navbar from "@/components/navbar/Navbar";
import HomeListings from "@/components/home/HomeListings";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
      <Navbar />
      <HomeListings />
    </div>
  );
}
