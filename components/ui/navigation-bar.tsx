"use client";

import {
  BarChartIcon,
  CalendarIcon,
  HomeIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton } from "./auth-button";

type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    path: "/",
    label: "Dashboard",
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    path: "/calendar",
    label: "Calendrier",
    icon: <CalendarIcon className="w-5 h-5" />,
  },
  {
    path: "/statistics",
    label: "Statistiques",
    icon: <BarChartIcon className="w-5 h-5" />,
  },
  {
    path: "/favorites",
    label: "Favoris",
    icon: <StarIcon className="w-5 h-5" />,
  },
];

export const NavigationBar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className="fixed md:sticky md:top-0 bottom-0 left-0 right-0 bg-white md:bg-white border-t 
      md:border-t-0 md:border-b border-strava-gray-200 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 md:py-3">
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center px-3 py-1.5 rounded-lg transition-all duration-200
                  ${
                    isActive(item.path)
                      ? "text-white bg-strava-orange"
                      : "text-strava-gray-600 hover:text-strava-orange hover:bg-strava-gray-50"
                  }`}
              >
                <span
                  className={`transition-transform duration-200 ${
                    isActive(item.path) ? "scale-110" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-xs mt-1 font-medium ${
                    isActive(item.path) ? "opacity-100" : "opacity-80"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};
