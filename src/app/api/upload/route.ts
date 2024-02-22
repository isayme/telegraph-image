// Next.js Edge API Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/router-handlers#edge-and-nodejs-runtimes

import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    let response = await fetch('https://telegra.ph/upload', {
      method: 'POST',
      body: formData,
    })

    return NextResponse.json(await response.json())
  } catch (e: any) {
    return NextResponse.json({ error: e.message })
  }
}
