import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/src/types/schema'
import { AccountForm } from './AccountForm'

export default async function Account() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <main className='container mx-auto h-full flex items-center justify-center'>
      <AccountForm session={session} />
    </main>
  )
}