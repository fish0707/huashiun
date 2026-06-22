import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    { data: products },
    { data: newPhones },
  ] = await Promise.all([
    supabase.from('products').select('id, created_at').eq('status', '在庫'),
    supabase.from('new_phones').select('id, created_at').eq('is_available', true),
  ])

  const productUrls: MetadataRoute.Sitemap = (products ?? []).map(p => ({
    url: `https://huashiun.vercel.app/product/${p.id}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const newPhoneUrls: MetadataRoute.Sitemap = (newPhones ?? []).map(p => ({
    url: `https://huashiun.vercel.app/new-phones/${p.id}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    { url: 'https://huashiun.vercel.app', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://huashiun.vercel.app/new-phones', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://huashiun.vercel.app/plans', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...productUrls,
    ...newPhoneUrls,
  ]
}
