import useCurrentTheme from "@/hooks/styles/theme";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { Button } from "../button/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "../sheet/sheet";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Image from "next/image";

const Header = () => {
  const { setTheme } = useTheme();

  const currentTheme = useCurrentTheme();

  const { connectors, connect } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const links = [
    {
      destination: "/",
      label: "Home",
    },
    // {
    //   destination: "/faucet",
    //   label: "Faucet",
    // },
    {
      destination: "/pools",
      label: "Pools",
    },
    {
      destination: "/history",
      label: "History",
    },
    {
      destination: "https://protect-fi.gitbook.io/protectfi",
      label: "Documentation",
    },
  ];

  const changeTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <div className=" backdrop-blur-sm fixed w-full border-b-2 border-gray-100 dark:border-gray-900 flex flex-row justify-between items-center py-2 px-2 lg:px-[5vw] z-50">
      <div className="flex flex-row gap-2">
        <Link href="/" className="flex flex-row gap-2">
          <Image
            src="/insure-b.webp"
            alt="Protect.Fi Logo"
            width={30}
            height={30}
            className="object-contain block dark:hidden"
          />
          <Image
            src="/insure-w.webp"
            alt="Protect.Fi Logo"
            width={30}
            height={30}
            className="object-contain hidden dark:block"
          />
          <p className="text-2xl lg:text-3xl font-bold mr-6">Protect.fi</p>
        </Link>
        <div className="hidden lg:flex gap-4">
          {links.map((link) =>
            link.label === 'Pools' ? (
              <div key={link.label} className="relative group">
                {/* Pools Link */}
                <Link href={link.destination} passHref>
                  <Button variant="link" className="relative z-10">
                    {link.label}
                  </Button>
                </Link>

                {/* Dropdown on Hover dengan Animasi */}
                <div
                  className="
                absolute left-1/2 transform -translate-x-1/2 
                top-full 
                bg-white dark:bg-black shadow-xl rounded-xl p-3 w-44 z-20 border border-gray-100
                opacity-0 scale-90 
                group-hover:opacity-100 group-hover:scale-100 
                transition-opacity transition-transform duration-500 ease-out 
                pointer-events-none group-hover:pointer-events-auto
              "
                >
                  <Link href="/pools" passHref>
                    <Button
                      variant="ghost"
                      className="
                    w-full justify-start bg-gray-100 text-sm 
                    hover:bg-gray-200 dark:hover:bg-gray-800 dark:bg-gray-700
                  "
                    >
                      Explore Pools
                    </Button>
                  </Link>
                  <Link href="/pools/create" passHref>
                    <Button
                      variant="ghost"
                      className="
                    w-full justify-start mt-1 bg-gray-100 text-sm 
                    hover:bg-gray-200 dark:hover:bg-gray-800 dark:bg-gray-700
                  "
                    >
                      Create Pools
                    </Button>
                  </Link>
                </div>
              </div>
            ) : link.label === 'Documentation' ? (
              <a
                key={link.label}
                href={link.destination}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                <Button variant="link">{link.label}</Button>
              </a>
            ) : (
              <Link key={link.label} href={link.destination} passHref>
                <Button variant="link">{link.label}</Button>
              </Link>
            )
          )}

        </div>


      </div>
      <div className="hidden lg:flex gap-2">
        <Button variant="ghost" onClick={changeTheme}>
          {currentTheme === "light" ? <Sun /> : <Moon />}
        </Button>
        <ConnectButton />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="block lg:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col gap-2">
            <Button className="w-[4rem]" variant="ghost" onClick={changeTheme}>
              {currentTheme === "light" ? <Sun /> : <Moon />}
            </Button>
            <ConnectButton />
            {links.map((link) => (
              <Link key={link.label} href={link.destination}>
                <Button className="p-0 m-0" variant="link">
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
