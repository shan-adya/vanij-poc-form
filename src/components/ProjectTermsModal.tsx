import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Markdown from 'react-markdown';

interface ProjectTermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

export default function ProjectTermsModal({
  open,
  onOpenChange,
  onAccept,
}: ProjectTermsModalProps) {
  const [canAccept, setCanAccept] = useState(false);
  const [content, setContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch the markdown content from public folder
    fetch('/terms.md')
      .then(response => response.text())
      .then(text => setContent(text))
      .catch(error => console.error('Error loading terms:', error));
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const isAtBottom = 
      Math.abs(
        element.scrollHeight - element.clientHeight - element.scrollTop
      ) < 1;
    
    if (isAtBottom) {
      setCanAccept(true);
    }
  };

  useEffect(() => {
    if (!open) {
      setCanAccept(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
        </DialogHeader>
        <ScrollArea 
          ref={scrollRef} 
          className="h-[400px] pr-4" 
          onScrollCapture={handleScroll}
        >
          <div className="prose prose-sm dark:prose-invert">
            <Markdown>{content}</Markdown>
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onAccept();
              onOpenChange(false);
            }}
            disabled={!canAccept}
            className="gradient-hover bg-gradient-to-r from-primary to-secondary text-white"
          >
            I Agree
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 