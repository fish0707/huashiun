'use client'
import { useEffect, useState } from 'react'
import { supabase, type Plan } from '@/lib/supabase'
import Header from '@/components/Header'
import { MessageCircle, Wifi, Phone, Clock, CheckCircle } from 'lucide-react'

const LINE_MSG = (plan: Plan) =>
  `https://line.me/R/ti/p/@306cvtwi?text=${encodeURIComponent(
    `您好，我想詢問【${plan.carrier} ${plan.plan_name}】月租 NT$${plan.monthly_fee} 的辦理方式，請問目前有什麼優惠？`
  )}`

const CARRIERS = ['全部', '中華電信', '遠傳', '台哥大']
const GENERATIONS = ['全部', '4G', '5G']

const CARRIER_COLORS: Record<string, { bg: string; text: string; border: string; badge: string; light: string }> = {
  '中華電信': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-600', light: 'bg-blue-100' },
  '遠傳':     { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-500', light: 'bg-orange-100' },
  '台哥大':   { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-600', light: 'bg-red-100' },
}

const TAG_COLORS: Record<string, string> = {
  '熱門': 'bg-red-500', '推薦': 'bg-blue-500', '限時': 'bg-amber-500',
  '4G': 'bg-gray-500', '5G': 'bg-purple-500',
}

const parseBonus = (bonus: string | null) => {
  if (!bonus) return { subsidy: null, prepay: null }
  const subsidyMatch = bonus.match(/補貼 NT\$([\d,]+)/)
  const prepayMatch = bonus.match(/預繳 NT\$([\d,]+)/)
  return {
    subsidy: subsidyMatch ? subsidyMatch[1] : null,
    prepay: prepayMatch ? prepayMatch[1] : null,
  }
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [carrier, setCarrier] = useState('全部')
  const [generation, setGeneration] = useState('全部')
  const [showUnlimited, setShowUnlimited] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])

  useEffect(() => {
    supabase.from('plans').select('*').eq('is_active', true).order('sort_order')
      .then(({ data }) => { setPlans(data ?? []); setLoading(false) })
  }, [])

  const filtered = plans.filter(p => {
    if (carrier !== '全部' && p.carrier !== carrier) return false
    if (showUnlimited && !p.is_unlimited) return false
    if (generation === '4G' && !p.plan_name.includes('4G')) return false
    if (generation === '5G' && !p.plan_name.includes('5G')) return false
    return true
  })

  const toggleCompare = (id: string) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const comparePlans = plans.filter(p => compareIds.includes(p.id))

  return (
    <div className="min-h-screen">
      <Header />

      <section className="bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-950 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-purple-400 text-sm font-medium tracking-widest uppercase mb-3">電信門號方案</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold leading-tight mb-4">
            三大電信<br /><span className="text-purple-400">一站比較</span>
          </h1>
          <p className="text-gray-400 max-w-md mb-8">中華電信、遠傳、台哥大方案透明比較，含搭機補貼金額</p>
          <div className="flex flex-wrap gap-4">
            {['中華電信', '遠傳', '台哥大'].map(c => (
              <div key={c} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
                <CheckCircle size={14} className="text-purple-400" />{c}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white border border-border rounded-2xl p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted mb-2">電信業者</p>
              <div className="flex flex-wrap gap-2">
                {CARRIERS.map(c => (
                  <button key={c} onClick={() => setCarrier(c)}
                    className={`px-4 py-1.5 rounded-full text-sm border transition-all ${carrier === c ? 'bg-ink text-white border-ink' : 'bg-white text-muted border-border hover:border-ink hover:text-ink'}`}>{c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted mb-2">網路世代</p>
              <div className="flex gap-2">
                {GENERATIONS.map(g => (
                  <button key={g} onClick={() => setGeneration(g)}
                    className={`px-4 py-1.5 rounded-full text-sm border transition-all ${generation === g ? 'bg-ink text-white border-ink' : 'bg-white text-muted border-border hover:border-ink hover:text-ink'}`}>{g}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs font-medium text-muted whitespace-nowrap">只看吃到飽</p>
              <button onClick={() => setShowUnlimited(!showUnlimited)}
                className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${showUnlimited ? 'bg-accent' : 'bg-gray-200'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${showUnlimited ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {compareIds.length > 0 && (
          <div className="bg-ink text-white rounded-2xl p-4 mb-6 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">已選 {compareIds.length} 個方案</span>
              <span className="text-xs text-gray-400">（最多3個）</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCompareIds([])} className="text-xs text-gray-400 hover:text-white transition-colors">清除</button>
              <a href="#compare" className="bg-accent text-ink text-xs font-bold px-4 py-1.5 rounded-full">查看比較</a>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-border rounded-2xl p-5 animate-pulse space-y-3">
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="h-8 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-4xl mb-4">📭</p>
            <p className="font-display text-xl">找不到符合條件的方案</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted mb-4">共 {filtered.length} 個方案</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(plan => {
                const colors = CARRIER_COLORS[plan.carrier] ?? CARRIER_COLORS['中華電信']
                const isComparing = compareIds.includes(plan.id)
                const { subsidy, prepay } = parseBonus(plan.bonus)
                return (
                  <div key={plan.id}
                    className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${isComparing ? 'border-accent ring-2 ring-accent/30' : 'border-border'}`}>
                    <div className={`${colors.bg} ${colors.border} border-b px-4 py-3 flex items-center justify-between`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`${colors.badge} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>{plan.carrier}</span>
                        {plan.tag && <span className={`${TAG_COLORS[plan.tag] ?? 'bg-gray-400'} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>{plan.tag}</span>}
                      </div>
                      <button onClick={() => toggleCompare(plan.id)}
                        className={`text-xs px-3 py-1 rounded-full border transition-all flex-shrink-0 ${isComparing ? 'bg-accent text-ink border-accent' : `${colors.text} ${colors.border} bg-white`}`}>
                        {isComparing ? '✓ 比較中' : '+ 比較'}
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-ink mb-2">{plan.plan_name}</h3>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="font-display text-4xl font-semibold text-ink">{plan.monthly_fee.toLocaleString()}</span>
                        <span className="text-sm text-muted">元/月</span>
                        <span className="text-xs text-muted ml-1">({plan.contract_months}個月)</span>
                      </div>
                      {(subsidy || prepay) && (
                        <div className={`${colors.light} rounded-xl p-3 mb-4 grid grid-cols-2 gap-2`}>
                          {subsidy && <div className="text-center"><p className="text-xs text-muted mb-0.5">搭機補貼</p><p className={`text-base font-bold ${colors.text}`}>NT${subsidy}</p></div>}
                          {prepay && prepay !== '0' ? (
                            <div className="text-center"><p className="text-xs text-muted mb-0.5">預繳金額</p><p className="text-base font-bold text-ink">NT${prepay}</p></div>
                          ) : (
                            <div className="text-center"><p className="text-xs text-muted mb-0.5">預繳金額</p><p className="text-base font-bold text-green-600">免預繳</p></div>
                          )}
                        </div>
                      )}
                      <div className="space-y-2.5 mb-4">
                        <div className="flex items-start gap-2.5"><Wifi size={14} className="text-muted flex-shrink-0 mt-0.5" /><div><p className="text-xs text-muted">網路流量</p><p className="text-sm font-medium">{plan.is_unlimited ? '⚡ 吃到飽' : `${plan.data_gb} GB`}{plan.speed_limit && !plan.is_unlimited && <span className="text-xs text-muted ml-1">（量到降速 {plan.speed_limit}）</span>}</p></div></div>
                        <div className="flex items-start gap-2.5"><Phone size={14} className="text-muted flex-shrink-0 mt-0.5" /><div><p className="text-xs text-muted">通話內容</p><p className="text-sm font-medium leading-relaxed">{plan.call_minutes}</p></div></div>
                        <div className="flex items-start gap-2.5"><Clock size={14} className="text-muted flex-shrink-0 mt-0.5" /><div><p className="text-xs text-muted">合約期間</p><p className="text-sm font-medium">{plan.contract_months} 個月</p></div></div>
                      </div>
                      <a href={LINE_MSG(plan)} target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#06C755] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#05b34c] transition-colors">
                        <MessageCircle size={15} />LINE 立即詢問
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {comparePlans.length >= 2 && (
          <section id="compare" className="mt-16">
            <div className="flex items-center gap-3 mb-6"><div className="w-1 h-5 bg-accent rounded-full" /><h2 className="font-display text-2xl font-semibold">方案比較</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-border rounded-2xl overflow-hidden">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted w-28">項目</th>
                    {comparePlans.map(p => {
                      const colors = CARRIER_COLORS[p.carrier] ?? CARRIER_COLORS['中華電信']
                      return <th key={p.id} className="p-4 text-center"><span className={`${colors.badge} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>{p.carrier}</span><p className="font-medium text-sm mt-1">{p.plan_name}</p></th>
                    })}
                  </tr>
                </thead>
                <tbody>
                  {([
                    ['月租費', (p: Plan) => `NT$${p.monthly_fee.toLocaleString()}`],
                    ['網路流量', (p: Plan) => p.is_unlimited ? '⚡ 吃到飽' : `${p.data_gb} GB`],
                    ['降速後', (p: Plan) => p.speed_limit || '—'],
                    ['通話', (p: Plan) => p.call_minutes ?? '—'],
                    ['合約', (p: Plan) => `${p.contract_months}個月`],
                    ['搭機補貼', (p: Plan) => { const { subsidy } = parseBonus(p.bonus); return subsidy ? `NT$${subsidy}` : '—' }],
                    ['預繳金額', (p: Plan) => { const { prepay } = parseBonus(p.bonus); return prepay === '0' ? '免預繳' : prepay ? `NT$${prepay}` : '—' }],
                  ] as [string, (p: Plan) => string][]).map(([label, fn]) => (
                    <tr key={label} className="border-b border-border last:border-0">
                      <td className="p-4 text-sm text-muted">{label}</td>
                      {comparePlans.map(p => <td key={p.id} className="p-4 text-sm text-center font-medium">{fn(p)}</td>)}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-4" />
                    {comparePlans.map(p => (
                      <td key={p.id} className="p-4 text-center">
                        <a href={LINE_MSG(p)} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-[#06C755] text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-[#05b34c] transition-colors">
                          <MessageCircle size={12} />LINE 詢問
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      <footer className="border-t border-border bg-white mt-20 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
          <span className="font-display text-xl font-semibold text-ink">華訊<span className="text-accent">通訊</span></span>
          <p>© 2025 華訊通訊 · 新機 · 二手機 · 門號方案</p>
          <a href="https://line.me/R/ti/p/@306cvtwi" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">LINE：@306cvtwi</a>
        </div>
      </footer>
    </div>
  )
}
