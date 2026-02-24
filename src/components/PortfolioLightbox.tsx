import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PortfolioLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photos: string[];
  initialIndex: number;
  title?: string;
}

export function PortfolioLightbox({
  open,
  onOpenChange,
  photos,
  initialIndex,
  title,
}: PortfolioLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) {
      setCurrentIndex(Math.min(Math.max(0, initialIndex), photos.length - 1));
    }
  }, [open, initialIndex, photos.length]);

  if (!photos.length) return null;

  const normalizedIndex = Math.max(0, Math.min(currentIndex, photos.length - 1));
  const currentUrl = photos[normalizedIndex];
  const fullUrl = currentUrl.startsWith("http") ? currentUrl : `https://${currentUrl}`;

  const goPrev = () => {
    setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
  };
  const goNext = () => {
    setCurrentIndex((i) => (i + 1) % photos.length);
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, photos.length, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] w-full max-h-[95vh] border-0 bg-transparent p-0 overflow-hidden shadow-none [&>button]:text-red-500 [&>button]:opacity-100 [&>button]:hover:text-red-400 [&>button]:focus:text-red-400"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="relative flex items-center justify-center min-h-[60vh] bg-black/90 rounded-lg">
          <img
            src={fullUrl}
            alt={title ? `${title} - ${normalizedIndex + 1}` : `Photo ${normalizedIndex + 1}`}
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
            draggable={false}
          />

          {photos.length > 1 && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg hover:scale-105"
                onClick={goPrev}
                aria-label="Photo précédente"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg hover:scale-105"
                onClick={goNext}
                aria-label="Photo suivante"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-sm text-white/90 bg-black/50 px-3 py-1 rounded-full">
            {normalizedIndex + 1} / {photos.length}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
