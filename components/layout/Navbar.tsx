import { NAVBAR_LINKS } from "@/src/constants/links.constant";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="container flex items-center justify-between mt-14">
      <Link href="/">
        <h1 className="font-black text-2xl text-darkBlue-1">Quick Blog</h1>
      </Link>
      <div className="flex items-center gap-x-5">
        {NAVBAR_LINKS.map((link) => (
          <Link
            key={link.text}
            className="text-gray-500 text-lg font-medium hover:text-gray-900 transition-colors duration-300"
            href={link.route}
          >
            {link.text}
          </Link>
        ))}
      </div>
    </div>
  );
}
