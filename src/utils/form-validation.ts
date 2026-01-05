
import { ZodSchema, z } from "zod";
import { useForm, UseFormProps, FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Strong password schema for authentication and account creation
export const strongPasswordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

export const FormSchemas = {
  login: z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
  }),
  contact: z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  }),
  booking: z.object({
    name: z.string().min(2, { message: "Name is required" }),
    email: z.string().email({ message: "Valid email is required" }),
    phone: z.string().min(10, { message: "Valid phone number is required" }),
    service: z.string().min(1, { message: "Please select a service" }),
    date: z.date({ required_error: "Please select a date" }),
    time: z.string().min(1, { message: "Please select a time" }),
    notes: z.string().optional(),
  }),
  profileUpdate: z.object({
    firstName: z.string().min(2, { message: "First name is required" }),
    lastName: z.string().min(2, { message: "Last name is required" }),
    email: z.string().email({ message: "Valid email is required" }),
    phone: z.string().min(10, { message: "Valid phone number is required" }),
    dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
    address: z.string().min(5, { message: "Valid address is required" }),
    emergencyContact: z.string().min(10, { message: "Emergency contact is required" }),
    insuranceProvider: z.string().min(1, { message: "Insurance provider is required" }),
    insuranceNumber: z.string().min(1, { message: "Insurance number is required" }),
  }),
};

export type LoginFormValues = z.infer<typeof FormSchemas.login>;
export type ContactFormValues = z.infer<typeof FormSchemas.contact>;
export type BookingFormValues = z.infer<typeof FormSchemas.booking>;
export type ProfileUpdateFormValues = z.infer<typeof FormSchemas.profileUpdate>;

export function useZodForm<T extends FieldValues>(
  schema: ZodSchema,
  options?: Omit<UseFormProps<T>, "resolver">
): UseFormReturn<T> {
  return useForm<T>({
    ...options,
    resolver: zodResolver(schema),
  });
}
