import * as z from "zod";

export const detailsFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  useCase: z.string().min(10, "Use case must be at least 10 characters"),
});

export type DetailsFormValues = z.infer<typeof detailsFormSchema>;