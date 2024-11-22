import * as v from "valibot"

export const ContactSchema = v.object({
    email: v.pipe(
        v.string(),
        v.nonEmpty('Please enter your email.'),
        v.email('The email address is badly formatted.')
    ),
    firstName: v.pipe(
        v.string(),
        v.nonEmpty('Please enter your first name.'),
    ),
    lastName: v.pipe(
        v.string(),
        v.nonEmpty('Please enter your last name.'),
    ),
    subject: v.pipe(
        v.string(),
        v.nonEmpty('Please enter a subject.'),
        v.minLength(3, 'Your subject must have 3 characters or more.'),
        v.maxLength(100, 'Your subject must be less than 100 characters')
    ),
    text: v.pipe(
        v.string(),
        v.nonEmpty('Please enter a message.'),
        v.minLength(8, 'Your message must have 8 characters or more.'),
        v.maxLength(1500, 'Your message must be less than 1500 characters')
    ),
    "cf-turnstile-response": v.pipe(v.string(), v.minLength(1, "Please complete the Turnstile challenge")),
});
export type ContactForm = v.InferInput<typeof ContactSchema>;
