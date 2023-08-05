import React from 'react'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>My Task: {params.id}</div>
  )
}
