import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useService } from '@/contexts/ServiceContext';
import { formatCurrency } from '@/lib/utils';
import RequestSummary from '@/components/RequestSummary';
import UserDetailsSummary from '@/components/UserDetailsSummary';

export default function Summary() {
  const navigate = useNavigate();
  const { selectedServices, userDetails, totalPrice } = useService();

  const isOnlyCustomLLM = 
    selectedServices.length === 1 && 
    selectedServices[0].id === 'custom-llm';

  const handleSubmit = () => {
    // In a real app, we would submit the request to an API here
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Review Your Request</h1>
      
      {isOnlyCustomLLM && (
        <Alert className="mb-8">
          <AlertDescription>
            Thank you! Someone from our team will contact you shortly to discuss your Custom LLM requirements.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8">
        <RequestSummary services={selectedServices} totalPrice={totalPrice} />
        <UserDetailsSummary details={userDetails} />
        
        <Card>
          <CardHeader>
            <CardTitle>Ready to Submit?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              {isOnlyCustomLLM 
                ? "Our team will review your Custom LLM request and contact you within 24-48 hours to discuss your specific requirements."
                : "Please review all the information above carefully. Once submitted, our team will review your request and get back to you within 24-48 hours."}
            </p>
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => navigate('/details')}>
                Back
              </Button>
              <Button onClick={handleSubmit}>Submit Request</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}