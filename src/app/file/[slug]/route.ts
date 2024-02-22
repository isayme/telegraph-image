import axios from 'axios'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug
  let res: any = await axios.get(`https://telegra.ph/file/${slug}`, {
    responseType: 'stream',
    decompress: false,
  })

  let headers = undefined
  if (res.headers) {
    headers = res.headers.toJSON()
  }
  return new Response(res.data, {
    headers,
    status: res.status,
  })
}
