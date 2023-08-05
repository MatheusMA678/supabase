import { supabase } from '@/src/services/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Index() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: task } = await supabase.from('tasks').select('*').limit(1).single()
  console.log(task)

  const { data: { publicUrl } } = supabase.storage.from("test_bucket").getPublicUrl('persons/luiz.jpg')
  console.log(publicUrl)

  return (
    <div>

      <Link href='/details' className='font-semibold text-xl hover:underline'>Detalhes</Link>

      <Image
        src={publicUrl}
        width={100}
        height={100}
        alt='luiz'
      />

    </div>
  )
}
