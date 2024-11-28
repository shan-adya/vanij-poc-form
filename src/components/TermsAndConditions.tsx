import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TermsAndConditionsProps {
  accepted: boolean;
  onAcceptChange: (checked: boolean) => void;
}

export default function TermsAndConditions({ accepted, onAcceptChange }: TermsAndConditionsProps) {
  const terms = [
    "Minimal charges for cloud usage and storage during the testing period.",
    "All third-party charges (e.g., LLM API, email, VoIP) will be paid by the client at actuals.",
    "No build charges during the POC phase. Charges apply for production deployment.",
    "Client must provide data and workflows in the required format."
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Terms and Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <ul className="list-disc pl-4 space-y-2">
            {terms.map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ul>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <Checkbox 
            id="terms" 
            checked={accepted} 
            onCheckedChange={(checked) => onAcceptChange(checked as boolean)} 
          />
          <Label htmlFor="terms" className="text-sm">
            I accept the terms and conditions
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}