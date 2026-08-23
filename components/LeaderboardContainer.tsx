'use client'

import { useState } from 'react'
import { LeaderboardTable, EntryItem } from './LeaderboardTable'
import { BidModal } from './BidModal'

interface LeaderboardContainerProps {
  entries: EntryItem[]
  topBid: number
}

export function LeaderboardContainer({ entries, topBid }: LeaderboardContainerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<EntryItem | null>(null)

  const handleOpenModal = (entry?: EntryItem) => {
    setSelectedEntry(entry || null)
    setIsModalOpen(true)
  }

  return (
    <>
      <LeaderboardTable entries={entries} onOpenBidModal={handleOpenModal} />
      <BidModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetEntry={selectedEntry}
        topBid={topBid}
      />
    </>
  )
}