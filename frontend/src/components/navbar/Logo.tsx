import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1.5 shrink-0">
      {/* Airbnb flame/A logo in brand red */}
      <svg
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
        fill="#FF385C"
        aria-hidden="true"
      >
        <path d="M16 1C10.925 1 7.5 5.21 7.5 9.5c0 3.542 1.818 6.49 3.95 9.045C13.9 21.5 16 24 16 24s2.1-2.5 4.55-5.455C22.682 15.99 24.5 13.042 24.5 9.5 24.5 5.21 21.075 1 16 1zm0 11.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM8.75 21.5C5.6 23.21 4 25.35 4 27.5c0 2.21 2.686 3.5 6.5 3.5 2.12 0 4.005-.528 5.5-1.35V26c0-1.657-2.686-3-6-3-.437 0-.852.034-1.25.1zm14.5 0c-.398-.066-.813-.1-1.25-.1-3.314 0-6 1.343-6 3v3.65c1.495.822 3.38 1.35 5.5 1.35 3.814 0 6.5-1.29 6.5-3.5 0-2.15-1.6-4.29-4.75-6z" />
      </svg>
      <span className="hidden sm:block text-[#FF385C] font-bold text-xl tracking-tight">
        airbnb
      </span>
    </Link>
  );
}
