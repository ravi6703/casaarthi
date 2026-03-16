"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface Flashcard {
  id: string;
  front_text: string;
  back_text: string;
  card_type: string;
  difficulty: string;
}

interface Props {
  cards: Flashcard[];
  onRate: (cardId: string, confidence: string) => void;
}

const CARD_TYPE_COLORS: Record<string, string> = {
  definition: "bg-blue-100 text-blue-700",
  formula: "bg-green-100 text-green-700",
  section: "bg-purple-100 text-purple-700",
  case_law: "bg-orange-100 text-orange-700",
  concept: "bg-indigo-100 text-indigo-700",
};

export function FlashcardDeck({ cards, onRate }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  if (cards.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No flashcards available for this topic yet.</p>
      </div>
    );
  }

  const card = cards[currentIndex];
  const progress = `${currentIndex + 1}/${cards.length}`;

  function nextCard() {
    if (currentIndex < cards.length - 1) {
      setFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  }

  function prevCard() {
    if (currentIndex > 0) {
      setFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  }

  function handleRate(confidence: string) {
    onRate(card.id, confidence);
    nextCard();
  }

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      if (diff > 0) prevCard();
      else nextCard();
    }
    setTouchStart(null);
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-xs">{progress}</Badge>
        <Badge className={CARD_TYPE_COLORS[card.card_type] ?? "bg-gray-100 text-gray-700"}>
          {card.card_type}
        </Badge>
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        className="perspective-1000 cursor-pointer"
        onClick={() => setFlipped(!flipped)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`relative w-full min-h-[250px] transition-transform duration-500 transform-style-preserve-3d ${
            flipped ? "rotate-y-180" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.5s",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl border-2 border-gray-200 bg-white p-6 flex flex-col items-center justify-center text-center shadow-sm"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-xs text-gray-400 uppercase mb-4 font-medium">Question / Term</p>
            <p className="text-lg font-medium text-gray-900 leading-relaxed">{card.front_text}</p>
            <p className="text-xs text-gray-400 mt-6">Tap to reveal answer</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl border-2 border-blue-200 bg-blue-50 p-6 flex flex-col items-center justify-center text-center shadow-sm"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-xs text-blue-400 uppercase mb-4 font-medium">Answer / Definition</p>
            <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">{card.back_text}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={prevCard} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Prev
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setFlipped(!flipped)}>
          <RotateCcw className="h-4 w-4 mr-1" /> Flip
        </Button>
        <Button variant="ghost" size="sm" onClick={nextCard} disabled={currentIndex === cards.length - 1}>
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Rating buttons (only when flipped) */}
      {flipped && (
        <div className="grid grid-cols-4 gap-2">
          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleRate("again")}>
            Again
          </Button>
          <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => handleRate("hard")}>
            Hard
          </Button>
          <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleRate("good")}>
            Good
          </Button>
          <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => handleRate("easy")}>
            Easy
          </Button>
        </div>
      )}
    </div>
  );
}
