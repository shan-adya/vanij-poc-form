import * as z from "zod";

export const detailsFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .transform((val) => val.replace(/\D/g, '')), // Remove non-digits
  company: z.string().min(2, "Company name must be at least 2 characters"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  useCase: z.string().min(10, "Please provide more details about your use case"),
});
export type DetailsFormValues = z.infer<typeof detailsFormSchema>;