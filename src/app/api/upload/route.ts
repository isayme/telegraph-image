'use server'

// Next.js Edge API Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/router-handlers#edge-and-nodejs-runtimes

import axios from 'axios'
import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    let response = await axios.postForm('https://telegra.ph/upload', formData)

    return NextResponse.json(response.data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message })
  }
}
