import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TermsModal({ open, onOpenChange }: TermsModalProps) {
  const [terms, setTerms] = useState<string>("");

  useEffect(() => {
    fetch("/terms.md")
      .then((res) => res.text())
      .then((text) => setTerms(text))
      .catch((err) => console.error("Failed to load terms:", err));
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Terms and Conditions
          </DialogTitle>
          <DialogDescription>
            Please read our terms and conditions carefully
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full px-4">
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground">
            <Markdown>{terms}</Markdown>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 