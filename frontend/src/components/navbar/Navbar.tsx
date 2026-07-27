import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Section 1 - Left: Airbnb Logo */}
          <div className="flex items-center justify-start shrink-0">
            <Logo />
          </div>

          {/* Section 2 - Center: SearchBar (Perfectly centered, flex: 1, max-width: 520px) */}
          <div className="flex-1 flex justify-center items-center min-w-0 px-2">
            <div className="w-full max-w-[520px]">
              <SearchBar />
            </div>
          </div>

          {/* Section 3 - Right: Right Navigation Menu */}
          <div className="flex items-center justify-end shrink-0 whitespace-nowrap">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
