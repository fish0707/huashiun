import Link from 'next/link'
import Image from 'next/image'
import { Eye } from 'lucide-react'
import type { Product } from '@/lib/supabase'

const STATUS_STYLES: Record<Product['status'], string> = {
  '在庫':  'badge-available',
  '預訂中': 'badge-reserved',
  '已售出': 'badge-sold',
}

const STATUS_DOT: Record<Product['status'], string> = {
  '在庫':  'bg-green-500',
  '預訂中': 'bg-amber-500',
  '已售出': 'bg-gray-400',
}

interface Props {
  product: Product
  animDelay?: string
}

export default function ProductCard({ product, animDelay }: Props) {
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  return (
    <Link href={`/product/${product.id}`}>
      <article className={`product-card animate-fade-up ${animDelay ?? ''}`}>
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {product.cover_image ? (
            <Image
              src={product.cover_image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-200">
              📱
            </div>
          )}

          {/* Status badge top-left */}
          <div className="absolute top-2 left-2">
            <span className={STATUS_STYLES[product.status]}>
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[product.status]}`} />
              {product.status}
            </span>
          </div>

          {/* Discount badge top-right */}
          {discount && product.status !== '已售出' && (
            <div className="absolute top-2 right-2">
              <span className="bg-accent text-ink text-xs font-bold px-2 py-0.5 rounded-full">
                -{discount}%
              </span>
            </div>
          )}

          {/* Sold overlay */}
          {product.status === '已售出' && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="font-display text-2xl text-gray-400 font-semibold rotate-[-15deg]">
                已售出
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-muted mb-1">{product.brand} · {product.storage} · {product.condition}</p>
          <h3 className="font-medium text-ink text-sm leading-snug mb-3 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-xl font-semibold text-ink">
                NT${product.price.toLocaleString()}
              </p>
              {product.original_price && (
                <p className="text-xs text-muted line-through">
                  NT${product.original_price.toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted">
              <Eye size={12} />
              {product.views}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
