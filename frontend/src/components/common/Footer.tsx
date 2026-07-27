"use client";

import { useState, memo } from "react";
import Link from "next/link";

import {
  Globe,
  ChevronDown,
  ChevronUp,
  Heart,
  ShieldCheck,
  HelpCircle,
  Building,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

type TabType = "Popular" | "Beach" | "Mountains" | "Outdoors" | "Cities" | "Trending";

interface Destination {
  city: string;
  category: string;
}

const DESTINATIONS: Record<TabType, Destination[]> = {
  Popular: [
    { city: "Canmore", category: "Pet-friendly rentals" },
    { city: "Benalmádena", category: "Beachfront rentals" },
    { city: "Marbella", category: "Luxury villa rentals" },
    { city: "Mijas", category: "Apartment rentals" },
    { city: "Prescott", category: "Cabin rentals" },
    { city: "Scottsdale", category: "Pet-friendly rentals" },
    { city: "Tucson", category: "House rentals" },
    { city: "Jasper", category: "Cabin rentals" },
    { city: "Mountain View", category: "Flat rentals" },
    { city: "Devonport", category: "Cottage rentals" },
    { city: "Mallacoota", category: "Beach rentals" },
    { city: "Ibiza", category: "Vacation rentals" },
    { city: "Anaheim", category: "Family rentals" },
    { city: "Monterey", category: "Oceanview stays" },
    { city: "Paso Robles", category: "Wine country rentals" },
    { city: "Santa Barbara", category: "Beach house stays" },
    { city: "Sonoma", category: "Cottage rentals" },
    { city: "Sedona", category: "Red rock retreats" },
  ],
  Beach: [
    { city: "Malibu", category: "Beachfront villas" },
    { city: "Bora Bora", category: "Overwater bungalows" },
    { city: "Cancun", category: "Resort rentals" },
    { city: "Maui", category: "Oceanfront condos" },
    { city: "Santorini", category: "Cliffside suites" },
    { city: "Positano", category: "Coastal apartments" },
    { city: "Canggu", category: "Surf shacks" },
    { city: "Nice", category: "Promenade rentals" },
    { city: "Miami Beach", category: "Penthouse suites" },
    { city: "Honolulu", category: "Beachside condos" },
    { city: "Dubrovnik", category: "Sea view apartments" },
    { city: "Phuket", category: "Tropical villas" },
    { city: "Mykonos", category: "Cycladic villas" },
    { city: "Key West", category: "Island cottages" },
    { city: "Nassau", category: "Harbourfront stays" },
    { city: "Playa del Carmen", category: "Beach condos" },
    { city: "Byron Bay", category: "Coastal retreats" },
    { city: "Gold Coast", category: "Highrise apartments" },
  ],
  Mountains: [
    { city: "Aspen", category: "Ski chalet rentals" },
    { city: "Zermatt", category: "Alpine chalets" },
    { city: "Cortina d'Ampezzo", category: "Mountain lodges" },
    { city: "Banff", category: "Log cabin rentals" },
    { city: "Whistler", category: "Ski-in ski-out stays" },
    { city: "Lake Tahoe", category: "Mountain homes" },
    { city: "Chamonix", category: "Alpine apartments" },
    { city: "Park City", category: "Mountain villas" },
    { city: "Interlaken", category: "Scenic chalets" },
    { city: "Queenstown", category: "Lake & mountain stays" },
    { city: "Gatlinburg", category: "Smoky mountain cabins" },
    { city: "Vail", category: "Luxury ski chalets" },
    { city: "Breckenridge", category: "Slope-side lodges" },
    { city: "Telluride", category: "Alpine estates" },
    { city: "St. Moritz", category: "Grand mountain suites" },
    { city: "Innsbruck", category: "Tyrolean chalets" },
    { city: "Steamboat Springs", category: "Ranch retreats" },
    { city: "Jackson Hole", category: "Wilderness cabins" },
  ],
  Outdoors: [
    { city: "Yellowstone", category: "Wilderness cabins" },
    { city: "Yosemite", category: "National park lodges" },
    { city: "Grand Canyon", category: "Desert glamping" },
    { city: "Zion", category: "Nature retreats" },
    { city: "Adirondacks", category: "Waterfront cabins" },
    { city: "Lake District", category: "Lakeside cottages" },
    { city: "Black Forest", category: "Forest rentals" },
    { city: "Blue Mountains", category: "Eco lodges" },
    { city: "Lofoten", category: "Arctic cabins" },
    { city: "Patagonia", category: "Wilderness estates" },
    { city: "Scottish Highlands", category: "Stone cottages" },
    { city: "Fiordland", category: "Eco retreats" },
    { city: "Moab", category: "Canyon glamping" },
    { city: "Acadia", category: "Coastal forest cabins" },
    { city: "Great Smoky Mountains", category: "Ridge cabins" },
    { city: "Torres del Paine", category: "Adventure lodges" },
    { city: "Kruger", category: "Safari lodges" },
    { city: "Tasmania", category: "Bushland sanctuaries" },
  ],
  Cities: [
    { city: "New York", category: "SoHo loft rentals" },
    { city: "Paris", category: "Montmartre apartments" },
    { city: "London", category: "Kensington flats" },
    { city: "Tokyo", category: "Shibuya city suites" },
    { city: "Rome", category: "Historic center flats" },
    { city: "Barcelona", category: "Gothic quarter stays" },
    { city: "Sydney", category: "Harbour view flats" },
    { city: "Amsterdam", category: "Canal house rentals" },
    { city: "Bangkok", category: "Skyline penthouses" },
    { city: "Dubai", category: "Luxury tower suites" },
    { city: "Vienna", category: "Imperial apartments" },
    { city: "Singapore", category: "Downtown suites" },
    { city: "Berlin", category: "Mitte loft apartments" },
    { city: "Prague", category: "Old town suites" },
    { city: "San Francisco", category: "Bay view apartments" },
    { city: "Toronto", category: "Downtown lofts" },
    { city: "Seoul", category: "Gangnam city suites" },
    { city: "Lisbon", category: "Alfama apartments" },
  ],
  Trending: [
    { city: "Göreme", category: "Cave house suites" },
    { city: "Saariselkä", category: "Glass igloo rentals" },
    { city: "Merzouga", category: "Desert luxury camps" },
    { city: "Cotswolds", category: "Stone barn conversions" },
    { city: "Manuel Antonio", category: "Treehouse retreats" },
    { city: "Gordes", category: "Provençal farmhouses" },
    { city: "Oia", category: "Caldera sunset suites" },
    { city: "Muskoka", category: "Canadian log cabins" },
    { city: "Positano", category: "Cliffside villas" },
    { city: "Amboise", category: "Loire Valley castles" },
    { city: "Tulum", category: "Eco beach villas" },
    { city: "Reykjavik", category: "Northern lights lodges" },
    { city: "Rovaniemi", category: "Santa village cabins" },
    { city: "Ubud", category: "Jungle pool villas" },
    { city: "Fjord Nærøy", category: "Norway fjord cabins" },
    { city: "Chefchaouen", category: "Blue city riads" },
    { city: "Lake Bled", category: "Island view chalets" },
    { city: "Hallstatt", category: "Alpine lake houses" },
  ],
};

const FOOTER_SECTIONS = [
  {
    title: "Support",
    links: [
      { label: "Help Centre", href: "#" },
      { label: "AirCover", href: "#" },
      { label: "Anti-discrimination", href: "#" },
      { label: "Disability support", href: "#" },
      { label: "Cancellation options", href: "#" },
      { label: "Report neighbourhood concern", href: "#" },
    ],
  },
  {
    title: "Hosting",
    links: [
      { label: "Airbnb your home", href: "#" },
      { label: "AirCover for Hosts", href: "#" },
      { label: "Hosting resources", href: "#" },
      { label: "Community forum", href: "#" },
      { label: "Hosting responsibly", href: "#" },
      { label: "Join a free Hosting class", href: "#" },
    ],
  },
  {
    title: "Airbnb",
    links: [
      { label: "Newsroom", href: "#" },
      { label: "New features", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Investors", href: "#" },
      { label: "Gift cards", href: "#" },
      { label: "Airbnb.org emergency stays", href: "#" },
    ],
  },
];

function FooterComponent() {
  const [activeTab, setActiveTab] = useState<TabType>("Popular");
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs: TabType[] = ["Popular", "Beach", "Mountains", "Outdoors", "Cities", "Trending"];
  const currentDestinations = DESTINATIONS[activeTab] || [];
  const visibleDestinations = isExpanded ? currentDestinations : currentDestinations.slice(0, 12);

  return (
    <footer className="bg-gray-50 dark:bg-zinc-900/90 border-t border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-200 text-sm transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Inspiration Section */}
        <section className="pb-10 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-zinc-100 mb-6">
            Inspiration for your next getaway
          </h2>

          {/* Responsive Tab Bar */}
          <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide border-b border-gray-200 dark:border-zinc-800 pb-1 mb-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsExpanded(false);
                  }}
                  className={`pb-3 font-medium transition-all duration-150 relative cursor-pointer ${isActive
                    ? "text-gray-900 dark:text-zinc-100 font-semibold"
                    : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200"
                    }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-zinc-100 rounded-full animate-in fade-in duration-200" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Destinations Grid (5-6 columns on desktop, 2-3 tablet, 1-2 mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-6 gap-x-4 transition-all duration-300">
            {visibleDestinations.map((dest, idx) => (
              <div key={idx} className="group cursor-pointer">
                <p className="font-semibold text-gray-900 dark:text-zinc-100 group-hover:underline text-sm truncate">
                  {dest.city}
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                  {dest.category}
                </p>
              </div>
            ))}
          </div>

          {/* Show More / Less Button */}
          {currentDestinations.length > 12 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-8 flex items-center gap-1.5 font-semibold text-gray-900 dark:text-zinc-100 hover:underline cursor-pointer transition-colors"
            >
              <span>{isExpanded ? "Show less" : "Show more"}</span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </section>

        {/* 3 Main Footer Columns */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-b border-gray-200 dark:border-zinc-800">
          {FOOTER_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-zinc-100">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.href}
                      className="text-gray-600 dark:text-zinc-400 hover:underline hover:text-gray-900 dark:hover:text-zinc-200 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Bottom Footer Bar */}
        <section className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600 dark:text-zinc-400">
          {/* Left / Copyright */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
            <span>© 2026 Airbnb Clone, Inc.</span>
            <span>·</span>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Sitemap
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Company details
            </a>
          </div>

          {/* Right / Selectors & Social Icons */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 font-semibold text-gray-900 dark:text-zinc-100">
              <button className="flex items-center gap-2 hover:underline cursor-pointer">
                <Globe size={15} />
                <span>English (IN)</span>
              </button>
              <button className="hover:underline cursor-pointer">
                ₹ INR
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-gray-800 dark:text-zinc-200">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="X"
              >
                <FaXTwitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}

const Footer = memo(FooterComponent);
export default Footer;
