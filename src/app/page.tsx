import { FileUpload } from '@/components/file-upload'
import { Toaster } from '@/components/ui/toaster'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <FileUpload></FileUpload>
      <Toaster />
    </main>
  )
}
