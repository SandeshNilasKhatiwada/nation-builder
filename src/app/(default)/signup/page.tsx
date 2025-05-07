"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, UserPlus } from "lucide-react";
import { createPeople } from "@/services/people";
import Layout from "@/components/Layout";

// Define schema for validation
const signupSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  phone_number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .optional(),
  sex: z.enum(["M", "F", "O"]).optional(),
  is_volunteer: z.boolean().default(false),
});

// Type for form values
type SignupFormValues = z.infer<typeof signupSchema>;

export default function DynamicSignupPage() {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      is_volunteer: false,
    },
  });

  const [fields, setFields] = useState<string[]>([]);

  // List of available fields to add dynamically
  const availableFields = [
    { key: "last_name", label: "Last Name", type: "text" },
    { key: "phone_number", label: "Phone Number", type: "tel" },
    { key: "sex", label: "Sex", type: "select" },
    { key: "is_volunteer", label: "Are you a volunteer?", type: "boolean" },
  ];

  // Add field dynamically
  const addField = (fieldKey: string) => {
    if (!fields.includes(fieldKey)) {
      setFields([...fields, fieldKey]);
    }
  };

  async function onSubmit(data: SignupFormValues) {
    const response = await createPeople(data);
    console.log(response);
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              <CardTitle className="text-2xl">Sign Up</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* First Name (Always visible) */}
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email (Always visible) */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Render Dynamic Fields */}
                {fields.includes("last_name") && (
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {fields.includes("phone_number") && (
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="(555) 555-5555"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {fields.includes("sex") && (
                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sex</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your sex" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="M">Male</SelectItem>
                            <SelectItem value="F">Female</SelectItem>
                            <SelectItem value="O">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {fields.includes("is_volunteer") && (
                  <FormField
                    control={form.control}
                    name="is_volunteer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Are you a volunteer?</FormLabel>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="w-4 h-4"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Add Field Dropdown */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Add More Fields</label>
                  <div className="flex gap-2 flex-wrap">
                    {availableFields.map(
                      (field) =>
                        !fields.includes(field.key) && (
                          <Button
                            key={field.key}
                            type="button"
                            onClick={() => addField(field.key)}
                            className="text-xs"
                          >
                            <Plus className="h-4 w-4 mr-1" /> {field.label}
                          </Button>
                        )
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full mt-4">
                  Sign Up
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
