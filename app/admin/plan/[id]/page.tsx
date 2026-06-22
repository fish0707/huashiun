'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, type Plan } from '@/lib/supabase'
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

const CARRIERS = ['中華電信', '遠傳', '台哥大']
const TAGS = ['', '熱門', '推薦', '限時']

export default function PlanFormPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const router = useRouter()
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    carrier: '中華電信' as Plan['carrier'],
    plan_name: '', monthly_fee: '', data_gb: '',
    is_unlimited: false, call_minutes: '無限',
    contract_months: '24', speed_limit: '1Mbps',
    bonus: '', tag: '', is_active: true, sort_order: '0',
  })

  useEffect(() => {
    if (isNew) return
    supabase.from('plans').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setForm({
        carrier: data.carrier, plan_name: data.plan_name,
        monthly_fee: String(data.monthly_fee), data_gb: String(data.data_gb ?? ''),
        is_unlimited: data.is_unlimited, call_minutes: data.call_minutes ?? '無限',
        contract_months: String(data.contract_months), speed_limit: data.speed_limit ?? '1Mbps',
        bonus: data.bonus ?? '', tag: data.tag ?? '', is_active: data.is_active,
        sort_order: String(data.sort_order),
      })
      setLoading(false)
    })
  }, [id, isNew])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const payload = {
      carrier: form.carrier, plan_name: form.plan_name,
      monthly_fee: parseInt(form.monthly_fee),
      data_gb: form.is_unlimited ? null : (form.data_gb ? parseInt(form.data_gb) : null),
      is_unlimited: form.is_unlimited, call_minutes: form.call_minutes,
      contract_months: parseInt(form.contract_months),
      speed_limit: form.speed_limit, bonus: form.bonus || null,
      tag: form.tag || null, is_active: form.is_active,
      sort_order: parseInt(form.sort_order),
    }
    if (isNew) await supabase.from('plans').insert(payload)
    else await supabase.from('plans').update(payload).eq('id', id)
    setSaving(false)
    router.push('/admin')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-paper"><Loader2 size={24} className="animate-spin text-accent" /></div>

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-ink text-white px-4 py-3">
        <span className="font-display text-xl font-semibold">手機<span className="text-accent">専</span> <span className="text-sm font-sans text-gray-400">管理後台</span></span>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/admin" className="flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-6 transition-colors">
          <ChevronLeft size={16} />返回
        </Link>
        <h1 className="font-display text-2xl font-semibold mb-6">{isNew ? '新增門號方案' : '編輯門號方案'}</h1>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
            <p className="font-medium text-sm">方案基本資訊</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">電信業者 *</label>
                <select value={form.carrier} onChange={e => setForm(f => ({ ...f, carrier: e.target.value as Plan['carrier'] }))} className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent bg-white">
                  {CARRIERS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">方案名稱 *</label>
                <input required value={form.plan_name} onChange={e => setForm(f => ({ ...f, plan_name: e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent" placeholder="5G 699 吃到飽" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">月租費 (NT$) *</label>
                <input required type="number" value={form.monthly_fee} onChange={e => setForm(f => ({ ...f, monthly_fee: e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent" placeholder="699" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">合約月數</label>
                <select value={form.contract_months} onChange={e => setForm(f => ({ ...f, contract_months: e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent bg-white">
                  <option value="0">不限約</option>
                  <option value="12">12 個月</option>
                  <option value="24">24 個月</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="unlimited" checked={form.is_unlimited} onChange={e => setForm(f => ({ ...f, is_unlimited: e.target.checked }))} className="w-4 h-4 accent-[#C8A96E]" />
              <label htmlFor="unlimited" className="text-sm font-medium">吃到飽方案</label>
            </div>
            {!form.is_unlimited && (
              <div>
                <label className="block text-xs text-muted mb-1">流量 (GB)</label>
                <input type="number" value={form.data_gb} onChange={e => setForm(f => ({ ...f, data_gb: e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent" placeholder="30" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">通話分鐘</label>
                <input value={form.call_minutes} onChange={e => setForm(f => ({ ...f, call_minutes: e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent" placeholder="無限 / 300分鐘" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">降速後速度</label>
                <input value={form.speed_limit} onChange={e => setForm(f => ({ ...f, speed_limit: e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent" placeholder="1Mbps" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">加碼優惠</label>
              <input value={form.bonus} onChange={e => setForm(f => ({ ...f, bonus: e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent" placeholder="搭機折 NT$3,000" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">標籤</label>
                <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent bg-white">
                  <option value="">無</option>
                  {TAGS.filter(Boolean).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">排序（數字小=前面）</label>
                <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-[#C8A96E]" />
              顯示此方案（上架中）
            </label>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={16} className="animate-spin" />儲存中...</> : (isNew ? '確認新增' : '儲存變更')}
          </button>
        </form>
      </div>
    </div>
  )
}
