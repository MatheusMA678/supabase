'use client'

import { Database } from "@/src/types/schema";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Profiles = Database['public']['Tables']['profiles']['Row']

interface AvatarProps {
  uid: string;
  url: Profiles['avatar_url'];
  size: number;
  onUpload: (url: string) => void;
}

export function Avatar({ uid, url, size, onUpload }: AvatarProps) {
  const supabase = createClientComponentClient<Database>()
  const [avatarUrl, setAvatarUrl] = useState<Profiles['avatar_url']>(url)
  const [uploading, setUploading] = useState(false)

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data)
      setAvatarUrl(url)

    } catch (error) {
      console.log("Erro ao baixar a imagem: ", error)
    }
  }

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você precisa selecionar uma imagem para fazer upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath)

    } catch (error) {
      alert('Erro ao fazer upload do avatar!')
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url, supabase])

  return (
    <div>
      {avatarUrl ? (
        <div className="object-cover object-center overflow-hidden rounded-full" style={{
          width: size,
          height: size
        }}>
          <Image
            width={size}
            height={size}
            src={avatarUrl}
            alt="Avatar"
            style={{
              width: size,
            }}
          />
        </div>
      ) : (
        <div className='rounded-full bg-zinc-600 animate-pulse' style={{
          width: size,
          height: size
        }} />
      )}

      <div className={`w-[${size}]`}>
        <label htmlFor="single" className="bg-blue-500 hover:bg-blue-600 text-sm font-semibold rounded px-4 py-2 flex items-center justify-center w-full cursor-pointer">
          {uploading ? 'Enviando...' : 'Enviar Imagem'}
        </label>
        <input
          className="invisible absolute"
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )

}