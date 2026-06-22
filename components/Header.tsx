'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Search, Menu, X, MessageCircle } from 'lucide-react'

const LINE_URL = 'https://line.me/R/ti/p/@306cvtwi'
const LINE_ADD = 'https://line.me/R/ti/p/@306cvtwi'

interface HeaderProps {
  onSearch?: (q: string) => void
  searchValue?: string
}

const NAV = [
  { label: '二手機', href: '/' },
  { label: '新機報價', href: '/new-phones' },
  { label: '門號方案', href: '/plans' },
]

export default function Header({ onSearch, searchValue = '' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        <Link href="/" className="flex-shrink-0">
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            華訊通訊<span className="text-accent">東海店</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                pathname === n.href
                  ? 'bg-ink text-white font-medium'
                  : 'text-muted hover:text-ink hover:bg-white'
              }`}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {onSearch && (
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="text" placeholder="搜尋..." value={searchValue}
                onChange={e => onSearch(e.target.value)}
                className="w-44 pl-9 pr-4 py-2 text-sm bg-white border border-border rounded-full outline-none focus:border-accent transition-colors" />
            </div>
          )}
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer"
            className="btn-gold flex items-center gap-1.5 !py-2 !px-4">
            <MessageCircle size={14} />LINE 詢問
          </a>
        </div>

        <div className="flex md:hidden items-center gap-3">
          {onSearch && (
            <button onClick={() => setSearchOpen(!searchOpen)}>
              <Search size={20} className="text-ink" />
            </button>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} className="text-ink" /> : <Menu size={20} className="text-ink" />}
          </button>
        </div>
      </div>

      {searchOpen && onSearch && (
        <div className="md:hidden px-4 pb-3 border-b border-border">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="text" placeholder="搜尋..." value={searchValue}
              onChange={e => onSearch(e.target.value)} autoFocus
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-border rounded-full outline-none focus:border-accent" />
          </div>
        </div>
      )}

      {menuOpen && (
        <nav className="md:hidden px-4 py-4 border-b border-border bg-paper flex flex-col gap-3 text-sm">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)}
              className={`font-medium ${pathname === n.href ? 'text-accent' : 'text-ink'}`}>
              {n.label}
            </Link>
          ))}
          <a href={LINE_ADD} target="_blank" rel="noopener noreferrer"
            className="btn-gold text-center mt-2">
            LINE：@306cvtwi
          </a>
        </nav>
      )}
    </header>
  )
}
