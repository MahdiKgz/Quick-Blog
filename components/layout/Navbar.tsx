import { NAVBAR_LINKS } from "@/src/constants/links.constant";
import Link from "next/link";
import { ThemeSwitch } from "../theme-switch";

export default function Navbar() {
  return (
    <div className="container flex items-center justify-between">
      <Link href="/">
        <h1 className="font-black text-2xl text-darkBlue-1 dark:text-blue-700">
          Quick Blog
        </h1>
      </Link>
      <div className="flex items-center gap-x-5">
        {NAVBAR_LINKS.map((link) => (
          <Link
            key={link.text}
            className="hidden sm:flex text-gray-500 dark:text-gray-400 text-lg font-medium hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-300"
            href={link.route}
          >
            {link.text}
          </Link>
        ))}

        <ThemeSwitch />
      </div>
    </div>
  );
}
