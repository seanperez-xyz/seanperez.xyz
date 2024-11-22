import { component$ } from "@builder.io/qwik";
import {
  formAction$,
  FormError,
  useForm,
  valiForm$,
} from "@modular-forms/qwik";
import { getDB } from "~/database";
import type { ContactForm } from "./schema";
import { ContactSchema } from "./schema";
import { contactTable } from "~/database/contact/contact.schema";
import { TextField } from "~/components/forms/text-field/text-field";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Turnstile } from "~/components/turnstile/turnstile";

export const useContactForm = formAction$<ContactForm>(
  async (values, event) => {
    // const formData = await event.request.formData();
    // const token = formData.get("cf-turnstile-response");
    // If verification passes, insert only the form data (excluding Turnstile token)
    const { "cf-turnstile-response": token, ...contactData } = values;

    if (!token) {
      throw new FormError<ContactForm>(
        "Please complete the Turnstile challenge",
      );
    }

    // Verify Turnstile first
    const verifyEndpoint =
      "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const result = await fetch(verifyEndpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        secret: event.env.get("CLOUDFLARE_SECRET_KEY"),
        response: token,
      }),
    }).then((res) => res.json());

    if (!result.success) {
      throw new FormError<ContactForm>("Turnstile verification failed");
    }

    const db = getDB();
    try {
      await db.insert(contactTable).values(contactData).execute();
      return { status: "success" };
    } catch (error) {
      throw new FormError<ContactForm>("Internal server error");
    }
  },
  valiForm$(ContactSchema),
);

export default component$(() => {
  const [contactForm, { Form, Field }] = useForm<ContactForm>({
    action: useContactForm(),
    loader: {
      value: {
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        text: "",
        "cf-turnstile-response": "",
      },
    },
    validate: valiForm$(ContactSchema),
  });

  return (
    <section class="flex justify-center">
      <Card class="max-w-md flex-grow">
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>Send Sean a message</CardDescription>
        </CardHeader>
        <Form>
          <CardContent>
            <Field name="firstName">
              {(field, props) => (
                <TextField
                  {...props}
                  value={field.value}
                  error={field.error}
                  label="First Name"
                  required
                />
              )}
            </Field>
            <Field name="lastName">
              {(field, props) => (
                <TextField
                  {...props}
                  value={field.value}
                  error={field.error}
                  label="Last Name"
                  required
                />
              )}
            </Field>
            <Field name="email">
              {(field, props) => (
                <TextField
                  {...props}
                  value={field.value}
                  error={field.error}
                  type="email"
                  label="Email"
                  placeholder="your@email.com"
                  required
                />
              )}
            </Field>
            <Field name="subject">
              {(field, props) => (
                <TextField
                  {...props}
                  value={field.value}
                  error={field.error}
                  label="Subject"
                  required
                />
              )}
            </Field>
            <Field name="text">
              {(field, props) => (
                <TextField
                  {...props}
                  value={field.value}
                  error={field.error}
                  label="Message"
                  placeholder="Write me a message..."
                  type="textarea"
                  required
                  rows={4}
                />
              )}
            </Field>
          </CardContent>
          <CardFooter class="flex flex-col gap-4">
            <Turnstile
              siteKey={import.meta.env.CLOUDFLARE_SITE_KEY}
              onVerify$={(token) => {
                console.log("Verified with token:", token);
              }}
            />
            <Button
              class="w-full"
              rounded="md"
              disabled={contactForm.invalid || contactForm.submitting}
              type="submit"
            >
              Submit
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </section>
  );
});
