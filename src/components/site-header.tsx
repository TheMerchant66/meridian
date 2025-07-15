"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DollarSign, Menu, X, ChevronDown } from "lucide-react"
import { FaKey } from "react-icons/fa"
import { createPortal } from "react-dom"
import Logo from "./common/Logo"


interface SiteHeaderProps {
  currentPage?: string
}

export default function SiteHeader({ currentPage = "" }: SiteHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleDropdownPosition = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const button = target.closest('button')
      if (button) {
        const rect = button.getBoundingClientRect()
        document.documentElement.style.setProperty('--dropdown-top', `${rect.bottom + window.scrollY}px`)
        document.documentElement.style.setProperty('--dropdown-left', `${rect.left + window.scrollX}px`)
      }
    }

    document.addEventListener('mouseover', handleDropdownPosition)
    return () => document.removeEventListener('mouseover', handleDropdownPosition)
  }, [])

  const navItems = [
    { name: "Home", path: "/" },
    {
      name: "Banking Services",
      path: "#",
      submenu: [
        { name: "Personal Banking", path: "/personal-banking" },
        { name: "Investments", path: "/investments" },
        { name: "Loans", path: "/loans" },
      ],
    },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "FAQs", path: "/faqs" },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setActiveDropdown(null)
  }

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName)
  }

  const isCurrentPage = (path: string) => {
    if (path === "/") return currentPage === "/"
    return currentPage === path
  }

  const isInSubmenu = (submenu: any[]) => {
    return submenu.some((item) => currentPage === item.path)
  }

  const handleMouseEnter = (e: React.MouseEvent, itemName: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      setCloseTimeout(null)
    }
    const rect = e.currentTarget.getBoundingClientRect()
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX - (192 - rect.width) / 2
    })
    setActiveMenu(itemName)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveMenu(null)
    }, 200) // 200ms delay before closing
    setCloseTimeout(timeout)
  }

  return (
    <header className="bg-zinc-900 backdrop-blur-sm rounded-t-3xl mx-2 sm:mx-5 pt-3 top-4 animate-in duration-700 overflow-visible">
      <div className="container mx-auto px-3 sm:px-4 lg:px-16 overflow-visible">
        <div className="flex justify-between items-center h-16 sm:h-18 overflow-visible">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-48 sm:w-52 bg-zinc-900 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Logo size="xxlarge" variant="white" />
            </div>
          
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 text-sm">
            {navItems.map((item, index) => (
              <div key={item.name} className="relative group">
                {item.submenu ? (
                  <>
                    <button
                      onMouseEnter={(e) => handleMouseEnter(e, item.name)}
                      onMouseLeave={handleMouseLeave}
                      className={`${
                        isInSubmenu(item.submenu)
                          ? "text-white font-semibold bg-zinc-700 px-3.5 py-1.5 rounded-2xl"
                          : "text-gray-100 hover:text-white hover:font-semibold bg-zinc-800/75 hover:bg-zinc-700 px-3.5 py-1.5 rounded-2xl transition-all duration-300 hover:scale-105"
                      } flex items-center animate-in fade-in slide-in-from-top-2 duration-500`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {item.name}
                      <ChevronDown className="ml-1 w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                    </button>
                    {activeMenu === item.name && typeof window !== 'undefined' && createPortal(
                      <div 
                        className="fixed z-[9999] w-48 bg-zinc-800 rounded-xl shadow-xl transition-all duration-300"
                        style={{
                          top: `${dropdownPosition.top}px`,
                          left: `${dropdownPosition.left}px`,
                          marginTop: '4px'
                        }}
                        onMouseEnter={() => {
                          if (closeTimeout) {
                            clearTimeout(closeTimeout)
                            setCloseTimeout(null)
                          }
                          setActiveMenu(item.name)
                        }}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="py-2">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.path}
                              href={subItem.path}
                              className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                                isCurrentPage(subItem.path)
                                  ? "text-white bg-zinc-700 font-semibold"
                                  : "text-gray-300 hover:text-white hover:bg-zinc-700"
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>,
                      document.body
                    )}
                  </>
                ) : (
                  <Link
                    href={item.path}
                    className={`${
                      isCurrentPage(item.path)
                        ? "text-white font-semibold bg-zinc-700 px-3.5 py-1.5 rounded-2xl"
                        : "text-gray-100 hover:text-white hover:font-semibold bg-zinc-800/75 hover:bg-zinc-700 px-3.5 py-1.5 rounded-2xl transition-all duration-300 hover:scale-105"
                    } animate-in fade-in slide-in-from-top-2 duration-500`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Login Button */}
          <div className="hidden sm:flex items-center space-x-4 animate-in fade-in slide-in-from-right-4 duration-700">
            <Link href="/login">
              <Button
                variant="ghost"
                className="px-3 sm:px-5 hover:bg-zinc-700 hover:text-white text-white rounded-xl text-sm bg-zinc-800 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                <FaKey className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:rotate-12" />
                <span className="hidden sm:inline">Access Account</span>
                <span className="sm:hidden">Login</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-white hover:bg-zinc-800 rounded-lg transition-all duration-300 hover:scale-110 animate-in fade-in slide-in-from-right-4 duration-700"
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`w-6 h-6 absolute transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
              />
              <X
                className={`w-6 h-6 absolute transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 border-t border-zinc-800">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item, index) => (
                <div key={item.name}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => handleDropdownToggle(item.name)}
                        className={`${
                          isInSubmenu(item.submenu)
                            ? "text-white font-semibold bg-zinc-700 px-4 py-3 rounded-xl"
                            : "text-gray-100 hover:text-white hover:bg-zinc-800 px-4 py-3 rounded-xl transition-all duration-300"
                        } w-full text-left flex items-center justify-between animate-in slide-in-from-left-4 duration-300`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {item.name}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            activeDropdown === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {/* Mobile Submenu */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          activeDropdown === item.name ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="pl-4 space-y-1 mt-2">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.path}
                              href={subItem.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`block px-4 py-2 rounded-lg transition-all duration-300 ${
                                isCurrentPage(subItem.path)
                                  ? "text-white font-semibold bg-zinc-700"
                                  : "text-gray-300 hover:text-white hover:bg-zinc-800 hover:translate-x-2"
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`${
                        isCurrentPage(item.path)
                          ? "text-white font-semibold bg-zinc-700 px-4 py-3 rounded-xl"
                          : "text-gray-100 hover:text-white hover:bg-zinc-800 px-4 py-3 rounded-xl transition-all duration-300 hover:translate-x-2"
                      } animate-in slide-in-from-left-4 duration-300`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <div
                className="pt-2 sm:hidden animate-in slide-in-from-left-4 duration-300"
                style={{ animationDelay: "300ms" }}
              >
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all duration-300 hover:scale-105 group">
                    <FaKey className="mr-2 w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                    Access Account
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
