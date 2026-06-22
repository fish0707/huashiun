'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, type Product } from '@/lib/supabase'
import { ChevronLeft, Upload, X, Loader2 } from 'lucide-react'
import Link from 'next/link'

const CONDITIONS = ['全新', '九成新', '八成新', '七成新', '六成新']
const STATUSES: Product['status'][] = ['在庫', '預訂中', '已售出']
const BRANDS = ['Apple', 'Samsung', 'ASUS', 'Sony', 'Google Pixel', 'Vivo', 'OPPO', 'Xiaomi', 'Nokia', '其他']

// ── 產生安全的檔名（移除中文和特殊字元）──
const safeFilename = (file: File) => {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  return `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
}

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const router = useRouter()
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const coverRef = useRef<HTMLInputElement>(null)
  const photosRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: '',
    price: '',
    original_price: '',
    description: '',
    brand: 'Apple',
    customBrand: '',
    storage: '',
    color: '',
    condition: '九成新',
    status: '在庫' as Product['status'],
    is_featured: false,
    cover_image: '',
    photos: [] as string[],
  })

  useEffect(() => {
    if (isNew) return
    supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
      if (data) {
        const isCustomBrand = !BRANDS.includes(data.brand)
        setForm({
          name: data.name,
          price: String(data.price),
          original_price: String(data.original_price ?? ''),
          description: data.description ?? '',
          brand: isCustomBrand ? '其他' : data.brand,
          customBrand: isCustomBrand ? data.brand : '',
          storage: data.storage ?? '',
          color: data.color ?? '',
          condition: data.condition,
          status: data.status,
          is_featured: data.is_featured,
          cover_image: data.cover_image ?? '',
          photos: data.photos ?? [],
        })
      }
      setLoading(false)
    })
  }, [id, isNew])

  const uploadFile = async (file: File, folder: string) => {
    const filename = safeFilename(file)
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(`${folder}/${filename}`, file, { upsert: true })
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage
      .from('product-images').getPublicUrl(data.path)
    return publicUrl
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    try {
      const url = await uploadFile(file, 'covers')
      setForm(f => ({ ...f, cover_image: url }))
    } catch (err) {
      console.error(err)
      alert('上傳失敗，請再試一次')
    }
    setUploadingCover(false)
  }

  const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    try {
      const urls = await Promise.all(files.map(f => uploadFile(f, 'photos')))
      setForm(f => ({ ...f, photos: [...f.photos, ...urls] }))
    } catch (err) {
      console.error(err)
      alert('上傳失敗，請再試一次')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const finalBrand = form.brand === '其他' && form.customBrand
      ? form.customBrand : form.brand

    const payload = {
      name: form.name,
      price: parseInt(form.price),
      original_price: form.original_price ? parseInt(form.original_price) : null,
      description: form.description,
      brand: finalBrand,
      storage: form.storage,
      color: form.color,
      condition: form.condition,
      status: form.status,
      is_featured: form.is_featured,
      cover_image: form.cover_image,
      photos: form.photos,
    }

    if (isNew) await supabase.from('products').insert({ ...payload, views: 0 })
    else await supabase.from('products').update(payload).eq('id', id)

    setSaving(false)
    router.push('/admin')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <Loader2 size={24} className="animate-spin text-accent" />
    </div>
  )

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-ink text-white px-4 py-3">
        <span className="font-display text-xl font-semibold">
          華訊通訊<span className="text-accent">東海店</span>
          <span className="text-sm font-sans text-gray-400 ml-2">管理後台</span>
        </span>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/admin" className="flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-6 transition-colors">
          <ChevronLeft size={16} />返回
        </Link>
        <h1 className="font-display text-2xl font-semibold mb-6">
          {isNew ? '新增二手機商品' : '編輯二手機商品'}
        </h1>

        <form onSubmit={handleSave} className="space-y-5">

          {/* Cover image */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <p className="font-medium text-sm mb-3">主圖</p>
            <div onClick={() => coverRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl overflow-hidden cursor-pointer hover:border-accent transition-colors"
              style={{ aspectRatio: '1' }}>
              {form.cover_image
                ? <img src={form.cover_image} alt="cover" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-2">
                    {uploadingCover
                      ? <Loader2 size={24} className="animate-spin text-accent" />
                      : <><Upload size={24} /><p className="text-sm">點擊上傳主圖</p></>
                    }
                  </div>
              }
            </div>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            {form.cover_image && (
              <button type="button"
                onClick={() => setForm(f => ({ ...f, cover_image: '' }))}
                className="text-xs text-red-500 mt-2 hover:underline">移除主圖</button>
            )}
          </div>

          {/* Extra photos */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <p className="font-medium text-sm mb-3">細節圖片</p>
            <div className="flex flex-wrap gap-3">
              {form.photos.map(url => (
                <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button"
                    onClick={() => setForm(f => ({ ...f, photos: f.photos.filter(p => p !== url) }))}
                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5">
                    <X size={10} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => photosRef.current?.click()}
                className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted hover:border-accent transition-colors text-2xl">
                +
              </button>
            </div>
            <input ref={photosRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotosUpload} />
          </div>

          {/* Product info */}
          <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
            <p className="font-medium text-sm">商品資訊</p>

            <div>
              <label className="block text-xs text-muted mb-1">型號名稱 *</label>
              <input required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent"
                placeholder="iPhone 15 Pro 256GB" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">售價 (NT$) *</label>
                <input required type="number" value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent"
                  placeholder="28000" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">原價 (NT$)</label>
                <input type="number" value={form.original_price}
                  onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent"
                  placeholder="35900" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted mb-1">品牌</label>
              <select value={form.brand}
                onChange={e => setForm(f => ({ ...f, brand: e.target.value, customBrand: '' }))}
                className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent bg-white">
                {BRANDS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>

            {form.brand === '其他' && (
              <div>
                <label className="block text-xs text-muted mb-1">自訂品牌名稱 *</label>
                <input required value={form.customBrand}
                  onChange={e => setForm(f => ({ ...f, customBrand: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent"
                  placeholder="例如：Realme、Motorola..." />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">容量</label>
                <input value={form.storage}
                  onChange={e => setForm(f => ({ ...f, storage: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent"
                  placeholder="例如：256GB" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">顏色</label>
                <input value={form.color}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent"
                  placeholder="例如：黑色" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">機況</label>
                <select value={form.condition}
                  onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent bg-white">
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">狀態</label>
                <select value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as Product['status'] }))}
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent bg-white">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted mb-1">商品說明</label>
              <textarea rows={3} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-accent resize-none"
                placeholder="台灣公司貨，電池健康度 95%，外觀九成新..." />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_featured}
                onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                className="w-4 h-4 accent-[#C8A96E]" />
              <div>
                <p className="text-sm font-medium">設為精選推薦</p>
                <p className="text-xs text-muted">顯示在首頁精選區塊</p>
              </div>
            </label>
          </div>

          <button type="submit" disabled={saving}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {saving
              ? <><Loader2 size={16} className="animate-spin" />儲存中...</>
              : (isNew ? '確認上架' : '儲存變更')
            }
          </button>
        </form>
      </div>
    </div>
  )
}
