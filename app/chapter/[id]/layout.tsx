import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chapter Details',
  description: 'Chapter details page with AI-enhanced learning resources',
}

export default function ChapterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
