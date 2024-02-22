'use client'

import { Progress } from '@/components/ui/progress'
import useClipboard from '@/hook/useClipboard'
import { useDrop } from 'ahooks'
import axios from 'axios'
import prettyBytes from 'pretty-bytes'
import React, { useRef, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { useToast } from './ui/use-toast'

const MAX_SIZE = 5 * 1000 * 1000

export function FileUpload() {
  const { toast } = useToast()

  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(0)
  const [imageUrl, setImageUrl] = useState<string>('')

  const [isCopied, setCopied] = useClipboard(
    () => {
      return imageUrl
    },
    {
      successDuration: 500,
    },
  )

  const fileInputRef = useRef<any>(null)
  const dragEleRef = useRef<HTMLDivElement>(null)

  function handleClick() {
    fileInputRef.current.click()
  }

  function copyUrl() {
    setCopied()
  }

  useDrop(dragEleRef, {
    onFiles: (files) => {
      dragEleRef.current?.classList.remove('border-blue-500')

      handleUpload(files)
    },
    onText: (text) => {
      toast({
        title: '不支持粘贴文本',
      })
    },
    onDragEnter: () => {
      dragEleRef.current?.classList.add('border-blue-500')
    },
    onDragLeave: () => {
      dragEleRef.current?.classList.remove('border-blue-500')
    },
  })

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      let files: File[] = []
      for (let i = 0; i < e.target.files.length; i++) {
        let file = e.target.files.item(i)
        if (file) {
          files.push(file)
        }
      }
      handleUpload(files)
    }
  }

  async function handleUpload(files: File[]) {
    setImageUrl('')
    setUploadFile(null)
    setUploadProgress(null)

    try {
      if (files.length <= 0) {
        return
      }

      if (files.length > 1) {
        toast({
          description: '单次最多拖拽1个图片',
        })
        return
      }

      const file = files[0]

      console.log('上传文件', file)
      if (!file.type.startsWith('image')) {
        toast({
          description: `仅支持上传图片`,
        })
        return
      }

      if (file.size > MAX_SIZE) {
        toast({
          description: `最大支持上传${prettyBytes(
            MAX_SIZE,
          )}, 您上传的文件大小为：${prettyBytes(file.size)}`,
        })
        return
      }

      setUploadFile(file)

      const resp = await axios.postForm(
        '/api/upload',
        {
          file: file,
        },
        {
          onUploadProgress: (progressEvent: any) => {
            const percentage =
              (progressEvent.loaded * 100) / progressEvent.total
            setUploadProgress(+percentage.toFixed(2))
          },
        },
      )

      let error = resp.data?.error
      if (resp.status >= 300 || error) {
        toast({
          title: '上传失败',
          description: error,
        })
        return
      }

      console.log('上传成功', resp.data)
      let url = resp.data[0].src.slice(1)
      setImageUrl(`${window.location.href}${url}`)
    } catch (e: any) {
      toast({
        title: '上传失败',
        description: e.message,
      })
    }
  }

  return (
    <Card className='w-full max-w-lg'>
      <CardHeader>
        <h2 className='text-lg font-medium'>上传图片</h2>
        <p className='text-sm font-medium muted'>
          支持格式 JPEG, PNG, GIF, 限制文件最大 5MB.
        </p>
      </CardHeader>
      <CardContent className='flex items-center gap-4 py-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleFilesChange}
          ref={fileInputRef}
          multiple={false}
          style={{ display: 'none' }}
        ></input>

        <div className='flex w-full py-4 gap-3'>
          <div className='flex relative'>
            <img
              alt='Preview'
              className='rounded-lg border bg-gray-100 w-28 h-28'
              src={
                uploadFile
                  ? URL.createObjectURL(uploadFile)
                  : `data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=`
              }
              style={{
                aspectRatio: '100/100',
                objectFit: 'cover',
              }}
            />

            <div
              className={
                'absolute flex items-center w-28 h-28 top-0 left-0 ' +
                `${
                  typeof uploadProgress === 'number' ? 'visible' : 'invisible'
                }`
              }
            >
              <Progress value={uploadProgress}></Progress>
              <div
                className={
                  'absolute flex justify-center items-center w-28 h-28 top-0 left-0 opacity-70 hover:opacity-100 ' +
                  `${imageUrl ? 'visible' : 'invisible'}`
                }
              >
                <div>
                  <Button onClick={copyUrl}>
                    复制{`${isCopied ? '成功' : '链接'}`}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div
            className='text-center grow hover:cursor-pointer border-dashed border'
            onClick={handleClick}
            ref={dragEleRef}
            autoFocus={true}
          >
            <div className='flex h-full flex-col items-center justify-center'>
              <UploadIcon className='w-14 h-12  text-gray-600' />
              <div className='text-sm leading-4 pt-4'>
                将图片拖动到此处 或 点击上传
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function UploadIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
      <polyline points='17 8 12 3 7 8' />
      <line x1='12' x2='12' y1='3' y2='15' />
    </svg>
  )
}
