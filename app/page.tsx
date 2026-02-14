'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push('/auth/login')
  }, [router])

  return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>
}
