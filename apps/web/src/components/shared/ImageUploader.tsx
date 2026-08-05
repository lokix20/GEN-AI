import { useCallback, useRef, useState } from "react";
import { Camera, ImagePlus, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface ImageUploaderProps {
  onFileSelected: (file: File) => void;
  previewUrl?: string | null;
  onClear?: () => void;
  className?: string;
}

export function ImageUploader({ onFileSelected, previewUrl, onClear, className }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const browseInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file && file.type.startsWith("image/")) onFileSelected(file);
    },
    [onFileSelected],
  );

  if (previewUrl) {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl border border-border/50", className)}>
        <img src={previewUrl} alt="Selected crop" className="max-h-72 w-full object-contain bg-muted" />
        {onClear && (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
        isDragging ? "border-forest bg-forest/5" : "border-border",
        className,
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <ImagePlus className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Drag & drop a photo here, or</p>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => browseInputRef.current?.click()}>
          Browse
        </Button>
        <Button type="button" variant="secondary" onClick={() => cameraInputRef.current?.click()}>
          <Camera className="mr-2 h-4 w-4" />
          Camera
        </Button>
      </div>

      <input
        ref={browseInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
