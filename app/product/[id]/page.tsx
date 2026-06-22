'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase, type Product } from '@/lib/supabase'
import Header from '@/components/Header'
import {
  MessageCircle, ChevronLeft, Eye, Share2,
  Shield, RefreshCw, CheckCircle, Phone
} from 'lucide-react'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)
  const [showInquiry, setShowInquiry] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setProduct(data)
        setLoading(false)
        // increment views
        if (data) supabase.rpc('increment_views', { product_id: id })
      })
  }, [id])

  const allPhotos = product
    ? [product.cover_image, ...(product.photos || [])].filter(Boolean)
    : []

  const lineUrl = product
    ? `https://line.me/R/ti/p/@306cvtwi?text=${encodeURIComponent(
        `您好，我對這台【${product.name}】NT$${product.price.toLocaleString()} 有興趣，可以詳細說明嗎？`
      )}`
    : '#'

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    setSubmitting(true)

    await supabase.from('inquiries').insert({
      product_id: product.id,
      customer_name: form.name,
      customer_phone: form.phone,
      message: form.message || `我對【${product.name}】有興趣`,
    })

    // Also send LINE notify via API route
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productName: product.name,
        price: product.price,
        customerName: form.name,
        customerPhone: form.phone,
      }),
    }).catch(() => {})

    setSubmitted(true)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-100 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-100 rounded w-3/4" />
              <div className="h-6 bg-gray-100 rounded w-1/2" />
              <div className="h-20 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center text-muted">
        <div className="text-center">
          <p className="text-5xl mb-4">😅</p>
          <p className="font-display text-2xl">找不到此商品</p>
          <Link href="/" className="mt-4 inline-block text-sm text-accent hover:underline">
            ← 回到首頁
          </Link>
        </div>
      </div>
    </div>
  )

  const statusColors = {
    '在庫': 'text-green-700 bg-green-50 border-green-200',
    '預訂中': 'text-amber-700 bg-amber-50 border-amber-200',
    '已售出': 'text-gray-500 bg-gray-50 border-gray-200',
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-6 transition-colors"
        >
          <ChevronLeft size={16} />
          返回列表
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Photos */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3">
              {allPhotos[activePhoto] ? (
                <Image
                  src={allPhotos[activePhoto]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl text-gray-200">📱</div>
              )}
              {product.status === '已售出' && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <span className="font-display text-4xl text-gray-400 font-semibold rotate-[-15deg]">已售出</span>
                </div>
              )}
            </div>
            {allPhotos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allPhotos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activePhoto === i ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <Image src={photo} alt="" width={64} height={64} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="animate-fade-up">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-sm text-muted mb-1">{product.brand} · {product.storage} · {product.color}</p>
                <h1 className="font-display text-3xl font-semibold text-ink leading-tight">{product.name}</h1>
              </div>
              <button
                onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
                className="text-muted hover:text-ink transition-colors mt-1"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Status + views */}
            <div className="flex items-center gap-3 mb-5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border font-medium ${statusColors[product.status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.status === '在庫' ? 'bg-green-500' : product.status === '預訂中' ? 'bg-amber-500' : 'bg-gray-400'}`} />
                {product.status}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted">
                <Eye size={14} />
                {product.views} 次瀏覽
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="font-display text-4xl font-semibold text-ink">
                NT${product.price.toLocaleString()}
              </p>
              {product.original_price && (
                <p className="text-sm text-muted line-through mt-0.5">
                  原價 NT${product.original_price.toLocaleString()}
                </p>
              )}
            </div>

            {/* Specs */}
            <div className="bg-paper rounded-xl p-4 mb-6 grid grid-cols-2 gap-3 text-sm">
              {[
                ['品牌', product.brand],
                ['型號', product.name],
                ['容量', product.storage],
                ['顏色', product.color],
                ['機況', product.condition],
                ['狀態', product.status],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-muted text-xs mb-0.5">{label}</p>
                  <p className="font-medium text-ink">{value || '—'}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="font-medium text-sm mb-2">商品說明</h3>
                <p className="text-sm text-muted leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                [Shield, '機況透明', '不隱瞞任何問題'],
                [CheckCircle, '功能保證', '嚴格測試通過'],
                [RefreshCw, '7天保固', '出問題我們處理'],
              ].map(([Icon, title, sub]) => (
                <div key={String(title)} className="text-center p-3 bg-paper rounded-xl">
                  <Icon size={18} className="text-accent mx-auto mb-1" />
                  <p className="text-xs font-medium">{String(title)}</p>
                  <p className="text-xs text-muted mt-0.5">{String(sub)}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            {product.status !== '已售出' ? (
              <div className="flex flex-col gap-3">
                <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="btn-gold flex items-center justify-center gap-2 w-full">
                  <MessageCircle size={18} />
                  LINE 立即詢問
                </a>
                <button
                  onClick={() => setShowInquiry(!showInquiry)}
                  className="btn-outline flex items-center justify-center gap-2 w-full"
                >
                  <Phone size={16} />
                  留下聯絡資料
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center text-muted">
                <p className="font-medium">此商品已售出</p>
                <p className="text-sm mt-1">歡迎透過 LINE 詢問類似商品</p>
                <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 btn-outline text-sm">
                  詢問類似商品
                </a>
              </div>
            )}

            {/* Inquiry form */}
            {showInquiry && !submitted && (
              <form onSubmit={handleInquiry} className="mt-4 bg-paper rounded-xl p-4 space-y-3 animate-fade-in">
                <p className="font-medium text-sm">留下您的聯絡資料，我們會盡快與您聯繫</p>
                <input
                  required
                  type="text"
                  placeholder="您的姓名"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-border rounded-xl outline-none focus:border-accent"
                />
                <input
                  type="tel"
                  placeholder="聯絡電話（選填）"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-border rounded-xl outline-none focus:border-accent"
                />
                <textarea
                  placeholder="想詢問的問題（選填）"
                  rows={3}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-border rounded-xl outline-none focus:border-accent resize-none"
                />
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? '送出中...' : '送出詢問'}
                </button>
              </form>
            )}
            {submitted && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-center text-green-700 animate-fade-in">
                <CheckCircle size={24} className="mx-auto mb-2" />
                <p className="font-medium">詢問已送出！</p>
                <p className="text-sm mt-1">我們會盡快透過電話或 LINE 聯絡您</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
