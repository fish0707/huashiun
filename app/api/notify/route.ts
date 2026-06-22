import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { productName, price, customerName, customerPhone } = await req.json()
    const token = process.env.LINE_NOTIFY_TOKEN

    if (!token) return NextResponse.json({ ok: false, error: 'No token' })

    const message = [
      '',
      '🔔 新詢問通知！',
      `📱 商品：${productName}`,
      `💰 價格：NT$${Number(price).toLocaleString()}`,
      `👤 客戶：${customerName}`,
      customerPhone ? `📞 電話：${customerPhone}` : '',
      `⏰ 時間：${new Date().toLocaleString('zh-TW')}`,
    ].filter(Boolean).join('\n')

    const body = new URLSearchParams({ message })

    await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('LINE Notify error:', err)
    return NextResponse.json({ ok: false })
  }
}
