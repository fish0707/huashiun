'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { supabase, type Product } from '@/lib/supabase'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { SlidersHorizontal, ChevronDown, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const LINE_URL = 'https://line.me/R/ti/p/@306cvtwi'
const LINE_ADD = 'https://line.me/R/ti/p/@306cvtwi'

const BRANDS = ['全部', 'Apple', 'Samsung', 'ASUS', 'Sony', '其他']
const CONDITIONS = ['全部', '全新', '九成新', '八成新', '七成新']
const SORT_OPTIONS = [
  { label: '最新上架', value: 'created_at_desc' },
  { label: '價格低到高', value: 'price_asc' },
  { label: '價格高到低', value: 'price_desc' },
  { label: '最多瀏覽', value: 'views_desc' },
]

function HomeContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [brand, setBrand] = useState(searchParams.get('brand') ?? '全部')
  const [condition, setCondition] = useState('全部')
  const [sort, setSort] = useState('created_at_desc')
  const [showFilters, setShowFilters] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('products').select('*')
    if (brand !== '全部') query = query.eq('brand', brand)
    if (condition !== '全部') query = query.eq('condition', condition)
    if (search) query = query.ilike('name', `%${search}%`)
    const [field, dir] = sort === 'created_at_desc' ? ['created_at', false]
      : sort === 'price_asc' ? ['price', true]
      : sort === 'price_desc' ? ['price', false]
      : ['views', false]
    query = query.order(field, { ascending: dir })
    const { data } = await query
    setProducts(data ?? [])
    setLoading(false)
  }, [brand, condition, search, sort])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  useEffect(() => {
    supabase.from('products').select('*').eq('is_featured', true).eq('status', '在庫').limit(4)
      .then(({ data }) => setFeatured(data ?? []))
  }, [])

  const delays = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6']

  return (
    <div className="min-h-screen">
      <Header onSearch={setSearch} searchValue={search} />

      {/* Hero */}
      <section className="relative"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/store-bg.jpg') center/cover no-repeat`,
          backgroundColor: '#1a1a2e',
        }}>
        <div className="max-w-6xl mx-auto px-4 py-20">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-3 animate-fade-in">嚴選二手好機</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold leading-tight mb-4 text-white animate-fade-up">
            華訊通訊東海店<br />
            <span className="text-accent">專業手機買賣</span>
          </h1>
          <p className="text-gray-300 max-w-md mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            新機現貨報價 · 二手嚴選 · 三大電信門號代辦<br />
            手機維修 · 手機配件
          </p>
          <div className="flex flex-wrap gap-3 mb-8 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            {['📱 手機買賣', '🔧 手機維修', '📋 門號申辦', '🔩 手機配件'].map(tag => (
              <span key={tag} className="bg-white/10 border border-white/20 text-white text-sm px-3 py-1.5 rounded-full backdrop-blur-sm">{tag}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <a href="#products" className="btn-gold">瀏覽二手機</a>
            <Link href="/new-phones" className="border border-white/40 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">新機報價</Link>
            <a href={LINE_URL} target="_blank" rel="noopener noreferrer"
              className="bg-[#06C755] text-white px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-[#05b34c] transition-colors">
              <MessageCircle size={15} />LINE 詢問
            </a>
          </div>
        </div>

        {/* Quick nav */}
        <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-3 gap-3">
            {[
              { href: '/new-phones', icon: '📱', label: '新機報價', sub: '現貨即時更新', external: false },
              { href: '/plans', icon: '📋', label: '門號方案', sub: '三大電信比較', external: false },
              { href: LINE_ADD, icon: '💬', label: 'LINE 加我', sub: '@306cvtwi', external: true },
            ].map(item => (
              item.external ? (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center p-3 rounded-xl hover:bg-white/10 transition-colors text-center">
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-gray-300">{item.sub}</p>
                </a>
              ) : (
                <Link key={item.href} href={item.href}
                  className="flex flex-col items-center p-3 rounded-xl hover:bg-white/10 transition-colors text-center">
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-gray-300">{item.sub}</p>
                </Link>
              )
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {featured.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-5 bg-accent rounded-full" />
              <h2 className="font-display text-2xl font-semibold">精選推薦</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-start">
              {featured.map((p, i) => <ProductCard key={p.id} product={p} animDelay={delays[i]} />)}
            </div>
          </section>
        )}

        {/* Filters */}
        <section id="products" className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {BRANDS.map(b => (
                <button key={b} onClick={() => setBrand(b)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition-all ${brand === b ? 'bg-ink text-white border-ink' : 'bg-white text-muted border-border hover:border-ink hover:text-ink'}`}>
                  {b}
                </button>
              ))}
              <button onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm border border-border text-muted hover:border-ink hover:text-ink transition-all">
                <SlidersHorizontal size={13} />篩選
              </button>
            </div>
            <div className="relative">
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 text-sm bg-white border border-border rounded-full outline-none focus:border-accent cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
          </div>
          {showFilters && (
            <div className="bg-white border border-border rounded-2xl p-4 mb-4 animate-fade-in">
              <p className="text-xs text-muted mb-2 font-medium">機況</p>
              <div className="flex gap-2 flex-wrap">
                {CONDITIONS.map(c => (
                  <button key={c} onClick={() => setCondition(c)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${condition === c ? 'bg-accent text-ink border-accent' : 'bg-white text-muted border-border hover:border-ink'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-border animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded" />
                  <div className="h-5 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-4xl mb-4">📭</p>
            <p className="font-display text-xl">找不到相關商品</p>
            <p className="text-sm mt-2">試試其他關鍵字或篩選條件</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted mb-4">共 {products.length} 件商品</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-start">
              {products.map((p, i) => <ProductCard key={p.id} product={p} animDelay={delays[i % 6]} />)}
            </div>
          </>
        )}
      </div>

      <footer className="border-t border-border bg-white mt-20 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
          <span className="font-display text-xl font-semibold text-ink">華訊通訊<span className="text-accent">東海店</span></span>
          <p>© 2025 華訊通訊東海店 · 手機買賣 · 維修 · 門號申辦</p>
          <a href={LINE_ADD} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">LINE：@306cvtwi</a>
        </div>
      </footer>
    </div>
  )
}

export default function HomePage() {
  return <Suspense><HomeContent /></Suspense>
}
