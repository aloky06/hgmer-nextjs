"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Image as ImageIcon,
  CalendarDays,
  Warehouse,
  Boxes,
  PackageSearch,
  ShoppingCart,
  LogOut,
  Store,
  BookOpenCheck,
  Flower2,
  FolderTree,
  Book,
  FileText,
  Star,
  Sun,
  Bell
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ "Spiritual & Astrology": false });

  const toggleMenu = (name: string) => setOpenMenus(prev => ({...prev, [name]: !prev[name]}));

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [pathname, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (pathname === "/admin/login") return <>{children}</>;
  if (!isAuthenticated) return null;

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const navGroups = [
    {
      title: "OVERVIEW",
      items: [
        { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
      ]
    },
    {
      title: "INVENTORY & FULFILLMENT",
      items: [
        { name: "Categories", path: "/admin/categories", icon: <FolderTree size={20} /> },
        { name: "Manage Products", path: "/admin/products", icon: <Boxes size={20} /> },
        { name: "Product Approvals", path: "/admin/products/approvals", icon: <BookOpenCheck size={20} /> },
        { name: "Dark Stores", path: "/admin/warehouses", icon: <Store size={20} /> },
        { name: "Stock Management", path: "/admin/inventory", icon: <Warehouse size={20} /> },
        { name: "Orders & Shipping", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
      ]
    },
    {
      title: "CONTENT & APP",
      items: [
        { name: "Banners", path: "/admin/banners", icon: <ImageIcon size={20} /> },
        { name: "Festivals", path: "/admin/festivals", icon: <CalendarDays size={20} /> },
        { name: "Notifications", path: "/admin/notifications", icon: <Bell size={20} /> },
      ]
    },
    {
      title: "PLATFORM SERVICES",
      items: [
        {
          name: "Spiritual & Astrology",
          icon: <Sun size={20} />,
          subItems: [
            { name: "Pandit Approvals", path: "/admin/pandits" },
            { name: "Pooja Types", path: "/admin/pooja-types" },
            { name: "Pandit Bookings", path: "/admin/bookings" },
            { name: "Pooja Vidhi Guides", path: "/admin/pooja-vidhi" },
            { name: "Consultancy Services", path: "/admin/consultancy" },
            { name: "Horoscope", path: "/admin/horoscope" },
            { name: "Panchang", path: "/admin/panchang" },
          ]
        }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-10 transition-all duration-300">
        <div className="p-6 pb-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff9933] to-[#e67e22] flex items-center justify-center shadow-lg shadow-orange-500/30">
              <PackageSearch className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">HGM Admin</h1>
              <p className="text-xs text-slate-400 font-medium">Platform OS</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-3 overflow-y-auto space-y-6 mt-4">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <h2 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {group.title}
              </h2>
              <div className="space-y-1">
                {group.items.map((item) => {
                  if ("subItems" in item && item.subItems) {
                    const isOpen = openMenus[item.name] || item.subItems.some((sub: any) => pathname === sub.path);
                    const isActive = item.subItems.some((sub: any) => pathname === sub.path);
                    return (
                      <div key={item.name} className="flex flex-col space-y-1">
                        <button
                          onClick={() => toggleMenu(item.name)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                            isActive || isOpen
                              ? "bg-slate-800 text-white"
                              : "hover:bg-slate-800 hover:text-white text-slate-300"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className={`${isActive || isOpen ? "text-[#ff9933]" : "text-slate-400 group-hover:text-white"} transition-colors`}>
                              {item.icon}
                            </span>
                            <span className={isActive ? "font-semibold" : ""}>{item.name}</span>
                          </div>
                          <span className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </span>
                        </button>
                        {isOpen && (
                          <div className="pl-10 space-y-1 mt-1">
                            {item.subItems.map((sub: any) => {
                              const isSubActive = pathname === sub.path;
                              return (
                                <Link
                                  key={sub.path}
                                  href={sub.path}
                                  className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                    isSubActive ? "text-[#ff9933] bg-[#ff9933]/10 font-semibold" : "text-slate-400 hover:text-white hover:bg-slate-800"
                                  }`}
                                >
                                  {sub.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const itemPath = (item as any).path;
                  const isActive = pathname === itemPath;
                  return (
                    <Link
                      key={itemPath}
                      href={itemPath}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? "bg-[#ff9933]/10 text-[#ff9933] font-semibold"
                          : "hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <span className={`${isActive ? "text-[#ff9933]" : "text-slate-400 group-hover:text-white"} transition-colors`}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 m-3 mt-auto bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white">
                AD
              </div>
              <div className="text-sm">
                <p className="text-white font-medium">Admin User</p>
                <p className="text-xs text-slate-400">admin@hgmer.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm z-0 sticky top-0">
          <h2 className="text-xl font-bold text-gray-800 capitalize">
            {pathname === '/admin' ? 'Dashboard Overview' : pathname.split('/').pop()?.replace('-', ' ')}
          </h2>
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all w-64" />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
            <button className="relative p-2 text-gray-400 hover:text-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-700 leading-none">Admin</p>
                <p className="text-xs text-gray-500 mt-1">Superuser</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#ff9933] to-[#e67e22] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-orange-500/20">
                A
              </div>
            </div>
          </div>
        </header>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
