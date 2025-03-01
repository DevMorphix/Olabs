// This file helps TypeScript understand the expected page props
import { Metadata } from 'next'

export interface PageProps {
  params: {
    id: string
  }
}

export function generateMetadata({ params }: PageProps): Metadata
