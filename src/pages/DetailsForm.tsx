import { useNavigate } from "react-router-dom";
import { useForm as useHookForm } from "react-hook-form";
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
  FormDescription,
} from "@/components/ui/form";
import PricingSummary from "@/components/PricingSummary";
import { useService } from "@/contexts/ServiceContext";
import { useForm } from "@/contexts/FormContext";
import { detailsFormSchema, type DetailsFormValues } from "@/lib/validations";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Info,
  User,
  Mail,
  Phone,
  Building2,
  BadgeCheck,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { flowUtils } from '@/lib/utils/flowState';

export default function DetailsForm() {
  const navigate = useNavigate();
  const { selectedServices, setUserDetails, projectData, projectId } = useService();
  const { formDetails, setFormDetails } = useForm();

  const form = useHookForm<DetailsFormValues>({
    resolver: zodResolver(detailsFormSchema),
    defaultValues: {
      firstName: formDetails?.firstName || "",
      lastName: formDetails?.lastName || "",
      email: formDetails?.email || "",
      phone: formDetails?.phone || "",
      company: formDetails?.company || "",
      designation: formDetails?.designation || "",
      useCase: formDetails?.useCase || "",
    },
  });

  useEffect(() => {
    const canAccessPage = flowUtils.canAccess('details', {
      projectData,
      projectId,
      projectTermsAccepted: true
    });

    if (!canAccessPage) {
      const redirectPath = flowUtils.getRedirectPath('details', {
        projectData,
        projectId,
        projectTermsAccepted: true
      });
      navigate(redirectPath);
    }
  }, [projectData, projectId, navigate]);

  const onSubmit = (data: DetailsFormValues) => {
    const submissionData = {
      ...data,
      name: `${data.firstName} ${data.lastName}`,
    };

    setUserDetails(submissionData);
    setFormDetails(submissionData);

    const isOnlyCustomLLM =
      selectedServices.length === 1 && selectedServices[0].id === "custom-llm";

    navigate(isOnlyCustomLLM ? "/vanij-poc/summary" : "/vanij-poc/terms");
  };

  const isOnlyCustomLLM =
    selectedServices.length === 1 && selectedServices[0].id === "custom-llm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 py-12"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Tell Us About You
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          We'll tailor our solutions to match your specific needs
        </p>
      </div>

      {isOnlyCustomLLM && (
        <Alert className="mb-8 border-primary/20 bg-primary/5 max-w-2xl mx-auto">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary/80">
            For Custom LLM development, we'll review your requirements and
            schedule a consultation to discuss the details.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-8"
        >
          <div className="p-8 rounded-xl border bg-card/50 backdrop-blur-sm shadow-lg">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            {...field}
                            className="bg-background/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            {...field}
                            className="bg-background/50"
                          />
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
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john@example.com"
                            {...field}
                            className="bg-background/50"
                          />
                        </FormControl>
                        {/* <FormDescription>
                          We'll never share your email with anyone else.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          Phone
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              +91
                            </span>
                            <Input
                              {...field}
                              className="pl-12 bg-background/50"
                              placeholder="1234567890"
                              maxLength={10}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                onChange(value);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          Company
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Acme Corp"
                            {...field}
                            className="bg-background/50"
                          />
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
                        <FormLabel className="flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4 text-primary" />
                          Designation
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Senior Manager"
                            {...field}
                            className="bg-background/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="useCase"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          Use Case Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe your use case and requirements..."
                            className="h-32 bg-background/50"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The more details you provide, the better we can assist
                          you.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 mt-8 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/vanij-poc")}
                    className="gap-2 w-full sm:w-auto"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Services
                  </Button>
                  <Button
                    type="submit"
                    className="gradient-hover bg-gradient-to-r from-primary to-secondary text-white w-full sm:w-auto"
                  >
                    {isOnlyCustomLLM ? "Go to Summary" : "Review Terms"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </motion.div>

        {/* <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-8"
        >
          <PricingSummary />
        </motion.div> */}
      </div>
    </motion.div>
  );
}
