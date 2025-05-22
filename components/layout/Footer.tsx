import { NAVBAR_LINKS } from "@/src/constants/links.constant";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <div className="container py-6 flex flex-col items-center justify-center gap-y-6">
      <div className="footer-head flex items-center gap-x-6">
        {NAVBAR_LINKS.map((link) => (
          <Link
            key={link.text}
            className="hidden sm:flex text-gray-500 dark:text-gray-400 text-lg font-medium hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-300"
            href={link.route}
          >
            {link.text}
          </Link>
        ))}
      </div>
      <span className="font-bold text-sm text-[#3E3E3E] dark:text-gray-400 text-center">
        Copyright © 2021 Quick Blog. All Rights Reserved.
      </span>
    </div>
  );
}

export default Footer;
