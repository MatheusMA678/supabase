import { supabase } from '@/src/services/supabase'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Index() {
  const { data: { session } } = await supabase.auth.getSession()

  const { data: user } = await supabase.from('profiles').select("*").eq("id", session?.user.id).single()

  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(user?.avatar_url!)

  return (
    <div>
      <header className="h-20 border-b border-zinc-700 flex items-center justify-between px-8">
        <div className='flex items-center gap-4 leading-none'>
          <h1 className='font-bold text-2xl'>Supabase App</h1>

        </div>

        <form action="/login">
          <button type='submit' data-user={!!session} className='rounded bg-green-500 data-[user=true]:bg-red-500 font-semibold text-sm text-white px-4 py-1.5 shadow-lg data-[user=true]:hover:bg-red-600 hover:bg-green-600 transition'>
            {!session && "Sign in"}
            {session && "Sign out"}
          </button>
        </form>
      </header>

      <main>
        {user && (
          <>
            <h2>Olá, {user.full_name}!</h2>
            <div className='object-cover w-16 h-16 overflow-hidden rounded-full'>
              <Image
                src={publicUrl}
                alt='Avatar'
                width={64}
                height={64}
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
