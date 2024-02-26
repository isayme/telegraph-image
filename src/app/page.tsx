'use client'

import { FileUpload } from '@/components/file-upload'
import { Toaster } from '@/components/ui/toaster'
import { useEffect } from 'react'

export default function Home() {
  useEffect(function () {
    let { innerHeight } = window
    document.documentElement.style.setProperty('--100vh', `${innerHeight}px`)

    function setRealHeight() {
      let { innerHeight } = window
      document.documentElement.style.setProperty('--100vh', `${innerHeight}px`)
    }

    window.addEventListener('resize', setRealHeight)
    return () => window.removeEventListener('resize', setRealHeight)
  }, [])

  return (
    <main className='flex real100vh flex-col items-center justify-center'>
      <FileUpload></FileUpload>
      <Toaster />
    </main>
  )
}
