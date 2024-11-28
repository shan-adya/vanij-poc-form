import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PricingSummary from "@/components/PricingSummary";
import TermsAndConditions from "@/components/TermsAndConditions";
import { useService } from "@/contexts/ServiceContext";
import { detailsFormSchema, type DetailsFormValues } from "@/lib/validations";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SERVICES } from "@/lib/constants";

export default function DetailsForm() {
  const navigate = useNavigate();
  const { selectedServices, setUserDetails } = useService();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(true);

  const form = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      designation: "",
      useCase: "",
    },
  });

  useEffect(() => {
    // Check if only Custom LLM is selected
    const isOnlyCustomLLM = 
      selectedServices.length === 1 && 
      selectedServices[0].id === 'custom-llm';
    
    setShowTerms(!isOnlyCustomLLM);
  }, [selectedServices]);

  const onSubmit = (data: DetailsFormValues) => {
    const isOnlyCustomLLM = 
      selectedServices.length === 1 && 
      selectedServices[0].id === 'custom-llm';

    if (!isOnlyCustomLLM && !termsAccepted) {
      return;
    }

    setUserDetails(data);
    navigate("/summary");
  };

  // If no services are selected, redirect to service selection
  useEffect(() => {
    if (selectedServices.length === 0) {
      navigate('/');
    }
  }, [selectedServices, navigate]);

  const isOnlyCustomLLM = 
    selectedServices.length === 1 && 
    selectedServices[0].id === 'custom-llm';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Project Details</h1>
      
      {isOnlyCustomLLM && (
        <Alert className="mb-8">
          <AlertDescription>
            For Custom LLM development, our team will contact you directly to discuss your specific requirements.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input placeholder="Senior Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="useCase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Use Case Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe your use case..."
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center pt-4">
                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                  Back
                </Button>
                <Button type="submit" disabled={!isOnlyCustomLLM && !termsAccepted}>
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="space-y-8">
          <PricingSummary />
          {showTerms && (
            <TermsAndConditions
              accepted={termsAccepted}
              onAcceptChange={setTermsAccepted}
            />
          )}
        </div>
      </div>
    </div>
  );
}