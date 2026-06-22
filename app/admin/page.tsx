'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type Product, type NewPhone, type Plan, type Inquiry } from '@/lib/supabase'
import { Plus, LogOut, Package, MessageSquare, Smartphone, CreditCard, Edit2, Trash2, Eye, Star, StarOff, CheckCircle } from 'lucide-react'
import Link from 'next/link'

type Tab = 'used' | 'new' | 'plans' | 'inquiries'

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('used')
  const [usedPhones, setUsedPhones] = useState<Product[]>([])
  const [newPhones, setNewPhones] = useState<NewPhone[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [inquiries, setInquiries] = useState<(Inquiry & { product: Product })[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/admin/login')
      else fetchAll()
    })
  }, [])

  const fetchAll = async () => {
    const [{ data: used }, { data: newP }, { data: plns }, { data: inqs }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('new_phones').select('*').order('created_at', { ascending: false }),
      supabase.from('plans').select('*').order('sort_order'),
      supabase.from('inquiries').select('*, product:products(*)').order('created_at', { ascending: false }),
    ])
    setUsedPhones(used ?? [])
    setNewPhones(newP ?? [])
    setPlans(plns ?? [])
    const inqData = (inqs ?? []) as (Inquiry & { product: Product })[]
    setInquiries(inqData)
    setUnreadCount(inqData.filter(i => !i.is_read).length)
  }

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/admin/login') }

  const updateStatus = async (id: string, status: Product['status']) => {
    await supabase.from('products').update({ status }).eq('id', id)
    setUsedPhones(p => p.map(prod => prod.id === id ? { ...prod, status } : prod))
  }
  const toggleFeaturedUsed = async (id: string, cur: boolean) => {
    await supabase.from('products').update({ is_featured: !cur }).eq('id', id)
    setUsedPhones(p => p.map(prod => prod.id === id ? { ...prod, is_featured: !cur } : prod))
  }
  const toggleFeaturedNew = async (id: string, cur: boolean) => {
    await supabase.from('new_phones').update({ is_featured: !cur }).eq('id', id)
    setNewPhones(p => p.map(prod => prod.id === id ? { ...prod, is_featured: !cur } : prod))
  }
  const deletePlan = async (id: string) => {
    if (!confirm('確定刪除此方案？')) return
    await supabase.from('plans').delete().eq('id', id)
    setPlans(p => p.filter(pl => pl.id !== id))
  }
  const deleteProduct = async (id: string, table: 'products' | 'new_phones') => {
    if (!confirm('確定刪除？')) return
    await supabase.from(table).delete().eq('id', id)
    if (table === 'products') setUsedPhones(p => p.filter(x => x.id !== id))
    else setNewPhones(p => p.filter(x => x.id !== id))
  }
  const markRead = async (id: string) => {
    await supabase.from('inquiries').update({ is_read: true }).eq('id', id)
    setInquiries(i => i.map(inq => inq.id === id ? { ...inq, is_read: true } : inq))
    setUnreadCount(c => Math.max(0, c - 1))
  }

  const statusColors: Record<Product['status'], string> = {
    '在庫': 'text-green-700 bg-green-50',
    '預訂中': 'text-amber-700 bg-amber-50',
    '已售出': 'text-gray-500 bg-gray-50',
  }

  const TABS = [
    { key: 'used' as Tab, Icon: Package, label: '二手機', count: usedPhones.length },
    { key: 'new' as Tab, Icon: Smartphone, label: '新機', count: newPhones.length },
    { key: 'plans' as Tab, Icon: CreditCard, label: '門號方案', count: plans.length },
    { key: 'inquiries' as Tab, Icon: MessageSquare, label: '詢問紀錄', count: inquiries.length, badge: unreadCount },
  ]

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-ink text-white px-4 py-3 flex items-center justify-between">
        <span className="font-display text-xl font-semibold">
          華訊通訊<span className="text-accent">東海店</span>
          <span className="text-sm font-sans font-normal text-gray-400 ml-2">管理後台</span>
        </span>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
            <Eye size={14} />預覽前台
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
            <LogOut size={14} />登出
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {([
            ['在庫二手機', usedPhones.filter(p => p.status === '在庫').length, 'text-green-600'],
            ['新機上架', newPhones.filter(p => p.is_available).length, 'text-blue-600'],
            ['門號方案', plans.filter(p => p.is_active).length, 'text-purple-600'],
            ['未讀詢問', unreadCount, 'text-accent'],
          ] as const).map(([label, value, color]) => (
            <div key={label} className="bg-white border border-border rounded-xl p-4">
              <p className="text-sm text-muted">{label}</p>
              <p className={`font-display text-3xl font-semibold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-border rounded-xl p-1 w-fit overflow-x-auto">
          {TABS.map(({ key, Icon, label, count, badge }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${tab === key ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>
              <Icon size={15} />{label}
              {badge ? (
                <span className="bg-accent text-ink text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{badge}</span>
              ) : (
                <span className="text-xs opacity-60">({count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Used phones */}
        {tab === 'used' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">二手機列表</h2>
              <Link href="/admin/product/new" className="btn-primary flex items-center gap-2 !py-2 !px-4 !text-sm"><Plus size={15} />新增二手機</Link>
            </div>
            <div className="space-y-2">
              {usedPhones.map(p => (
                <div key={p.id} className="bg-white border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden">
                    {p.cover_image ? <img src={p.cover_image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">📱</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-muted">{p.storage} · {p.condition}</p>
                    <p className="font-display text-base font-semibold">NT${p.price.toLocaleString()}</p>
                  </div>
                  <select value={p.status} onChange={e => updateStatus(p.id, e.target.value as Product['status'])}
                    className={`text-xs px-3 py-1.5 rounded-full border-0 font-medium outline-none cursor-pointer ${statusColors[p.status]}`}>
                    <option>在庫</option><option>預訂中</option><option>已售出</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleFeaturedUsed(p.id, p.is_featured)} className={`p-1.5 rounded-lg transition-colors ${p.is_featured ? 'text-accent' : 'text-gray-300 hover:text-accent'}`}>
                      {p.is_featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                    </button>
                    <Link href={`/admin/product/${p.id}`} className="p-1.5 rounded-lg text-muted hover:text-ink transition-colors"><Edit2 size={16} /></Link>
                    <button onClick={() => deleteProduct(p.id, 'products')} className="p-1.5 rounded-lg text-muted hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New phones */}
        {tab === 'new' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">新機列表</h2>
              <Link href="/admin/new-phone/new" className="btn-primary flex items-center gap-2 !py-2 !px-4 !text-sm"><Plus size={15} />新增新機</Link>
            </div>
            <div className="space-y-2">
              {newPhones.map(p => (
                <div key={p.id} className="bg-white border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden">
                    {p.cover_image ? <img src={p.cover_image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">📱</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-muted">{p.storage} · {p.color}</p>
                    <p className="font-display text-base font-semibold">NT${p.price.toLocaleString()}</p>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${p.is_available ? 'text-blue-700 bg-blue-50' : 'text-gray-500 bg-gray-50'}`}>
                    {p.is_available ? '上架中' : '已下架'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleFeaturedNew(p.id, p.is_featured)} className={`p-1.5 rounded-lg transition-colors ${p.is_featured ? 'text-accent' : 'text-gray-300 hover:text-accent'}`}>
                      {p.is_featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                    </button>
                    <Link href={`/admin/new-phone/${p.id}`} className="p-1.5 rounded-lg text-muted hover:text-ink transition-colors"><Edit2 size={16} /></Link>
                    <button onClick={() => deleteProduct(p.id, 'new_phones')} className="p-1.5 rounded-lg text-muted hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plans */}
        {tab === 'plans' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">門號方案列表</h2>
              <Link href="/admin/plan/new" className="btn-primary flex items-center gap-2 !py-2 !px-4 !text-sm"><Plus size={15} />新增方案</Link>
            </div>
            <div className="space-y-2">
              {plans.map(p => (
                <div key={p.id} className="bg-white border border-border rounded-xl p-4 flex items-center gap-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white flex-shrink-0 ${p.carrier === '中華電信' ? 'bg-blue-600' : p.carrier === '遠傳' ? 'bg-orange-500' : 'bg-red-600'}`}>{p.carrier}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{p.plan_name}</p>
                    <p className="text-xs text-muted">{p.is_unlimited ? '吃到飽' : `${p.data_gb}GB`} · {p.contract_months === 0 ? '不限約' : `${p.contract_months}個月`}</p>
                  </div>
                  <p className="font-display text-lg font-semibold">NT${p.monthly_fee.toLocaleString()}</p>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${p.is_active ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-50'}`}>
                    {p.is_active ? '上架中' : '已下架'}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/plan/${p.id}`} className="p-1.5 rounded-lg text-muted hover:text-ink transition-colors"><Edit2 size={16} /></Link>
                    <button onClick={() => deletePlan(p.id)} className="p-1.5 rounded-lg text-muted hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inquiries */}
        {tab === 'inquiries' && (
          <div>
            <h2 className="font-semibold text-lg mb-4">詢問紀錄（{inquiries.length}）</h2>
            {inquiries.length === 0 ? (
              <div className="text-center py-12 text-muted"><p className="text-4xl mb-3">📭</p><p>目前沒有詢問</p></div>
            ) : (
              <div className="space-y-3">
                {inquiries.map(inq => (
                  <div key={inq.id} className={`bg-white border rounded-xl p-4 ${!inq.is_read ? 'border-accent' : 'border-border'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {!inq.is_read && <span className="w-2 h-2 rounded-full bg-accent" />}
                          <p className="font-medium text-sm">{inq.customer_name}</p>
                          {inq.customer_phone && <a href={`tel:${inq.customer_phone}`} className="text-xs text-accent hover:underline">{inq.customer_phone}</a>}
                          <span className="text-xs text-muted">{new Date(inq.created_at).toLocaleString('zh-TW')}</span>
                        </div>
                        <p className="text-xs text-muted mb-2">詢問商品：<Link href={`/product/${inq.product_id}`} target="_blank" className="text-accent hover:underline">{inq.product?.name ?? '已刪除'}</Link></p>
                        {inq.message && <p className="text-sm text-ink">{inq.message}</p>}
                      </div>
                      {!inq.is_read && (
                        <button onClick={() => markRead(inq.id)} className="flex items-center gap-1.5 text-xs text-muted hover:text-green-600 transition-colors flex-shrink-0">
                          <CheckCircle size={14} />標記已讀
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
