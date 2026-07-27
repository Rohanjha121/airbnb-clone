import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          <Logo />
          <SearchBar />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
