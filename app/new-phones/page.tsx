'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase, type NewPhone } from '@/lib/supabase'
import Header from '@/components/Header'
import Link from 'next/link'
import { RefreshCw, Circle } from 'lucide-react'

const LINE_ADD = 'https://line.me/R/ti/p/@306cvtwi'

const BRANDS = ['全部', 'Apple', 'Samsung', 'ASUS', 'Sony', 'Google Pixel', 'Vivo', 'OPPO', 'Xiaomi', 'Nokia', '其他']

const BRAND_COLORS: Record<string, string> = {
  'Apple':        'bg-gray-800 text-white',
  'Samsung':      'bg-blue-700 text-white',
  'ASUS':         'bg-blue-500 text-white',
  'Sony':         'bg-black text-white',
  'Google Pixel': 'bg-green-600 text-white',
  'Vivo':         'bg-blue-400 text-white',
  'OPPO':         'bg-green-500 text-white',
  'Xiaomi':       'bg-orange-500 text-white',
  'Nokia':        'bg-blue-600 text-white',
  '其他':          'bg-gray-500 text-white',
}

export default function NewPhonesPage() {
  const [phones, setPhones] = useState<NewPhone[]>([])
  const [loading, setLoading] = useState(true)
  const [brand, setBrand] = useState('全部')
  const [search, setSearch] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  const fetchPhones = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('new_phones').select('*').eq('is_available', true)
    if (brand !== '全部') query = query.eq('brand', brand)
    if (search) query = query.ilike('name', `%${search}%`)
    query = query.order('brand').order('name')
    const { data } = await query
    setPhones(data ?? [])
    setLastUpdated(new Date().toLocaleString('zh-TW', {
      month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }))
    setLoading(false)
  }, [brand, search])

  useEffect(() => { fetchPhones() }, [fetchPhones])

  const grouped = phones.reduce<Record<string, NewPhone[]>>((acc, p) => {
    if (!acc[p.brand]) acc[p.brand] = []
    acc[p.brand].push(p)
    return acc
  }, {})

  const brandOrder = ['Apple', 'Samsung', 'ASUS', 'Sony', 'Google Pixel', 'Vivo', 'OPPO', 'Xiaomi', 'Nokia']
  const sortedBrands = Object.keys(grouped).sort((a, b) => {
    const ai = brandOrder.indexOf(a)
    const bi = brandOrder.indexOf(b)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearch} searchValue={search} />

      <div className="bg-ink text-white py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="font-display text-xl font-semibold">手機現貨報價</h1>
            <p className="text-gray-400 text-xs mt-0.5">價格每日更新，以實際為準</p>
          </div>
          {lastUpdated && (
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              <RefreshCw size={11} />更新：{lastUpdated}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {BRANDS.map(b => (
              <button key={b} onClick={() => setBrand(b)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  brand === b ? 'bg-ink text-white' : 'text-gray-500 hover:text-ink hover:bg-gray-100'
                }`}>
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 border-b border-gray-100 bg-gray-50" />
            ))}
          </div>
        ) : phones.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">📭</p>
            <p>找不到相關商品</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedBrands.map(brandName => (
              <div key={brandName} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className={`px-4 py-2.5 ${BRAND_COLORS[brandName] ?? 'bg-gray-600 text-white'}`}>
                  <span className="font-bold text-sm tracking-wide">{brandName}</span>
                </div>
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500">
                  <div className="col-span-5">型號</div>
                  <div className="col-span-2 text-center">顏色</div>
                  <div className="col-span-2 text-center">容量</div>
                  <div className="col-span-2 text-right">未稅價</div>
                  <div className="col-span-1 text-center">現貨</div>
                </div>
                {grouped[brandName].map((phone, idx) => (
                  <Link key={phone.id} href={`/new-phones/${phone.id}`}>
                    <div className={`grid grid-cols-12 gap-2 px-4 py-2.5 text-sm border-b border-gray-100 last:border-0 hover:bg-blue-50 transition-colors cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <div className="col-span-5 font-medium text-gray-800 truncate">{phone.name}</div>
                      <div className="col-span-2 text-center text-gray-600 text-xs">{phone.color || '—'}</div>
                      <div className="col-span-2 text-center text-gray-600 text-xs">{phone.storage || '—'}</div>
                      <div className="col-span-2 text-right font-bold text-ink">
                        {phone.price > 0
                          ? `$${phone.price.toLocaleString()}`
                          : <span className="text-gray-400 font-normal text-xs">洽詢</span>
                        }
                      </div>
                      <div className="col-span-1 flex justify-center items-center">
                        <Circle size={10} className={(phone.in_stock ?? phone.is_available) ? 'text-green-500 fill-green-500' : 'text-gray-300 fill-gray-300'} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 px-1">
          <div className="flex items-center gap-1.5"><Circle size={8} className="text-green-500 fill-green-500" /><span>現貨</span></div>
          <div className="flex items-center gap-1.5"><Circle size={8} className="text-gray-300 fill-gray-300" /><span>缺貨</span></div>
          <span className="text-gray-400">· 點擊商品查看詳情</span>
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-white mt-10 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
          <span className="font-display text-xl font-semibold text-ink">華訊通訊<span className="text-accent">東海店</span></span>
          <p>© 2025 華訊通訊東海店 · 新機 · 二手機 · 門號方案</p>
          <a href={LINE_ADD} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">LINE：@306cvtwi</a>
        </div>
      </footer>
    </div>
  )
}
