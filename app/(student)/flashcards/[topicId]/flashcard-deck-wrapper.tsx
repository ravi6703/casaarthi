"use client";
import { FlashcardDeck } from "@/components/flashcards/flashcard-deck";

interface Props {
  cards: any[];
}

export function FlashcardDeckWrapper({ cards }: Props) {
  async function handleRate(cardId: string, confidence: string) {
    try {
      await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flashcardId: cardId, confidence }),
      });
    } catch {
      // silent
    }
  }

  return <FlashcardDeck cards={cards} onRate={handleRate} />;
}
