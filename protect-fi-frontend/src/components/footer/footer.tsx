import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 py-6 sm:py-8 md:py-10 transition-colors duration-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo and Description Section */}
          <div className="sm:col-span-2">
            <div className="flex items-center mb-3 sm:mb-4">
              <Link href="/" className="flex flex-row items-center gap-2">
                <Image
                  src="/insure-b.webp"
                  alt="Protect.Fi Logo"
                  width={28}
                  height={28}
                  className="object-contain block dark:hidden sm:w-[30px] sm:h-[30px]"
                />
                <Image
                  src="/insure-w.webp"
                  alt="Protect.Fi Logo"
                  width={28}
                  height={28}
                  className="object-contain hidden dark:block sm:w-[30px] sm:h-[30px]"
                />
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white">Protect.fi</p>
              </Link>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-lg">
              Leveraging smart contracts on blockchain, our platform ensures secure, automated claim processing and full control over your policies—no intermediaries required.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4 mt-4">
              {[
                { href: "https://twitter.com/ProtectFi", icon: "twitter", label: "Twitter" },
                { href: "https://github.com/protect-fi", icon: "github", label: "GitHub" },
                { href: "https://discord.gg/protect-fi", icon: "discord", label: "Discord" }
              ].map(({ href, icon, label }) => (
                <a
                  key={icon}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200"
                >
                  <i className={`fab fa-${icon} text-lg sm:text-xl`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Protocol Links */}
          <div className="mt-6 sm:mt-0">
            <h3 className="text-neutral-900 dark:text-neutral-100 font-bold text-lg mb-3 sm:mb-4">
              Protocol
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {['Insurance Pools', 'Claim Processing', 'Validator Network', 'Tokenomics'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200 text-sm sm:text-base"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="mt-6 sm:mt-0">
            <h3 className="text-neutral-900 dark:text-neutral-100 font-bold text-lg mb-3 sm:mb-4">
              Resources
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {['Documentation', 'Whitepaper', 'Security', 'FAQs'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200 text-sm sm:text-base"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-6 pt-6 sm:mt-8 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-500">
            © {new Date().getFullYear()} Protect.fi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
