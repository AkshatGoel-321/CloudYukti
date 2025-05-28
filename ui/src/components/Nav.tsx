/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Yukti Bot", href: "/yukti-bot" },
  { name: "GPU Recommender", href: "/gpurecommender" },
]

const Navbar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const { loading } = useAuth()
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = (): void => {
    setIsSidebarOpen(false)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    setTimeout(() => {
      router.replace(`/`)
      router.refresh()
    }, 1000)
  }

  const NavLink: React.FC<{ item: any; onClick?: () => void }> = ({ item, onClick }) => (
    <Link
      href={item.href}
      className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-300"
      onClick={onClick}
    >
      {item.name}
    </Link>
  )
  const AuthButton: React.FC<{ href: string; onClick?: () => void; children: React.ReactNode }> = ({
    href,
    onClick,
    children,
  }) => (
    <Link
      href={href}
      onClick={onClick}
      className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 rounded"
    >
      {children}
    </Link>
  )

  const NavDropdown: React.FC<{ category: string; items: any[] }> = ({ category, items }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-4 py-2 text-sm font-medium rounded-xl text-foreground hover:text-primary">
          {category} <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background border-border rounded-xl">
        {items.map((item) => (
          <DropdownMenuItem key={item.name} className="hover:bg-secondary rounded-xl">
            <NavLink item={item} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const isNavCategory = (item: any): item is { category: string; items: any[] } => {
    return "category" in item && "items" in item
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background shadow-md" : "bg-background/80 backdrop-blur"} border-b border-border`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-primary">
            CloudYukti
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item, index) =>
              isNavCategory(item) ? (
                <NavDropdown key={index} category={item.category} items={item.items} />
              ) : (
                <NavLink key={index} item={item} />
              ),
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

           {loading ? (
              <span>Loading...</span>
            ) : session ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                      <AvatarFallback>
                        {session.user?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border-border rounded-xl min-w-[160px]">
                    <DropdownMenuItem asChild>
                      <Link href="/requests" className="w-full">Previous Requests</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <AuthButton href="/sign-in">Login</AuthButton>
                <AuthButton href="/sign-up">Register</AuthButton>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="text-primary hover:text-primary/80"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 dark:bg-black/50" onClick={closeSidebar}>
          <div
            className="fixed right-0 top-0 h-full w-64 bg-background shadow-lg z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-4">
              <Button onClick={closeSidebar} variant="ghost" size="icon">
                <X className="h-6 w-6 text-primary" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4 p-4">
              {navItems.map((item, index) =>
                isNavCategory(item) ? (
                  <div key={index}>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                      {item.category}
                    </h3>
                    {item.items.map((subItem) => (
                      <NavLink key={subItem.name} item={subItem} onClick={closeSidebar} />
                    ))}
                  </div>
                ) : (
                  <NavLink key={index} item={item} onClick={closeSidebar} />
                ),
              )}
             {loading ? (
  <span>Loading...</span>
) : session ? (
  <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
          <AvatarFallback>
            {session.user?.name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border-border rounded-xl min-w-[160px]">
        <DropdownMenuItem asChild>
          <Link href="/requests" className="w-full">Previous Requests</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>
) : (
  <>
    <AuthButton href="/sign-in">Login</AuthButton>
    <AuthButton href="/sign-up">Register</AuthButton>
  </>
)}
            </nav>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
