'use client'
import { useCallback, useEffect, useState } from 'react'
import { Database } from '@/src/types/schema'
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Avatar } from './avatar'
import { useRouter } from 'next/navigation'

export function AccountForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const user = session?.user

  const router = useRouter()

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null
    fullname: string | null
    website: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)

      let { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className='flex flex-col'>
        <label className='font-semibold text-lg' htmlFor="email">Email</label>
        <input className='rounded-lg border border-zinc-300 h-10 px-4 bg-zinc-800' id="email" type="text" value={session?.user.email} disabled />
      </div>
      <div className='flex flex-col'>
        <label className='font-semibold text-lg' htmlFor="fullName">Nome Completo</label>
        <input className='rounded-lg border border-zinc-300 h-10 px-4 bg-zinc-800'
          id="fullName"
          type="text"
          value={fullname || ''}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>
      <div className='flex flex-col'>
        <label className='font-semibold text-lg' htmlFor="username">Usuário</label>
        <input className='rounded-lg border border-zinc-300 h-10 px-4 bg-zinc-800'
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className='flex flex-col mb-2'>
        <label className='font-semibold text-lg' htmlFor="website">Site</label>
        <input className='rounded-lg border border-zinc-300 h-10 px-4 bg-zinc-800'
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {user && (
        <Avatar
          uid={user.id}
          url={avatar_url}
          size={150}
          onUpload={(url) => {
            setAvatarUrl(url)
            updateProfile({
              fullname,
              username,
              website,
              avatar_url: url
            })
          }}
        />
      )}

      <div className='flex flex-row-reverse items-center gap-4'>
        <button
          className="bg-green-500 rounded px-4 py-2 text-sm font-semibold hover:bg-green-600 transition flex-1"
          onClick={() => {
            updateProfile({ fullname, username, website, avatar_url })
            router.push("/")
          }}
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>

        <form action="/auth/signout" method="post" className='flex-1'>
          <button className="bg-red-500 rounded px-4 py-2 w-full text-sm font-semibold hover:bg-red-600 transition" type="submit">
            Sair
          </button>
        </form>
      </div>
    </div>
  )
}