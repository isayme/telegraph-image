import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug

  let res = await fetch(`https://telegra.ph/file/${slug}`, {
    method: 'GET',
  })

  return new Response(res.body, {
    headers: res.headers,
    status: res.status,
  })
}
