---
layout: post
title: "Some Useful Tips And Tricks About Form Validation in JavaScript"
tags: tutorial webdev javascript
image: /img/posts/zod.png
typewriter-delay: 20
---

As time goes by, sooner or later, every developer has been tasked with building a form. 🛠️

Well, as far as I'm concerned, that's not one of the funniest things to do. 😅

But it turns out that even the simplest of websites out there is going to need at least a basic contact form. 🤷‍♂️

And, sometimes, there are cases where you are building a really complex and big application with forms everywhere. 🤓

They might be so big that you have to split them into multiple steps! 😮

But, in this post, I'm not going to show you a specific way of building a form nor how to split it into multiple steps, for example.

I'm going to try to be framework agnostic as well, but I might use a couple of lines of `React` here and there, as that's what I mostly use day by day.

Anyway, I promise you that this will not prevent you from using what I will show you in any other framework you might happen to use or even [Vanilla JS](http://vanilla-js.com/)!

Well, at this point you may be wondering what I'm precisely going to talk about, then? 🧐

## Data Validation ✅/❌

> In computer science, data validation is the process of ensuring data have undergone data cleansing to ensure they have data quality, that is, that they are both correct and useful.
>
> -- <cite>[Wikipedia][1]</cite>

To my advice, one of the most important tasks we have while building a form is to ensure that the data is proactively validated.

Of course, there MUST be validation on the backend as well, that's mandatory. ☝️

Never validate data only on the front-end! This might be dangerous. ☢️

But, actually, the real reason why you should do that is to preserve the mental health of your user. Really! 😂

As a matter of fact, as a user, I often run into long and/or complex and evil forms that give no hint to me about what I should do next or if the data that I provided is correct. 😈

These are some questions that I'm sure even you had while filling out this kind of forms:

1. Is there life on Mars? 👽
2. Will the code I wrote yesterday compile? 🤔
3. But most importantly... Why the hell is the f\*\*\*\* submit button disabled?!? 🤬

Well, to be honest, sometimes it happens that the submit button is ALWAYS enabled (really?). 😶

As a developer, I strive to do my best to avoid these frustrating situations.

If only we could make the user “fail fast, fail often”...

What if I told you we can accomplish this task easily?

## Zod to the rescue 🚑

> Zod is a TypeScript-first schema declaration and validation library for JavaScript and Node.js.

-- <cite>[Zod GitHub Page](https://github.com/colinhacks/zod)</cite>

### Install

```shell
yarn add zod
```

If you are using `TypeScript`, you don't need to install any additional type definitions, as Zod is written in TypeScript and provides its own types.

### Play with it! 👨‍💻

We are now ready to get our hands dirty!

For the sake of it, I'm going to show you how to validate a simple contact form.

Let's pretend we require the user to provide us these pieces of information:

- Name
- Surname
- Birth Date
- Sex
- Years Of Proficiency in Web Development
- Email
- Phone Number
- A link to a portfolio

All of the fields are required except `Sex` and `Phone Number`.

We should end up writing this schema with `Zod`:

```js
const { z } = require("zod");

const contactSchema = z.object({
  name: z.string(),
  surname: z.string(),
  birthDate: z.date(),
  sex: z.enum(["Male", "Female"]).optional(),
  yearsOfProficiency: z
    .number()
    .positive()
    .refine((val) => val > 0, { message: "Don't be shy!" }),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  portfolio: z.string().url(),
});
```

Straightforward, right?

But, what if we want to make a property required based on the value of another field?

Let's say that we would like to be able to contact the user in some way: we don't care if by email or by calling them.

Therefore, we have to make sure that at least the email OR the phone is provided.

Well, that's easily done with this schema:

```js
const contactSchema = z
  .object({
    name: z.string(),
    surname: z.string(),
    birthDate: z.date(),
    sex: z.enum(["Male", "Female"]).optional(),
    yearsOfProficiency: z
      .number()
      .positive()
      .refine((val) => val > 0, { message: "Don't be shy!" }),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    portfolio: z.string().url(),
  })
  .refine((data) => data.email || data.phoneNumber, {
    message: "You should provide at least either an email or a phone number",
    path: ["email", "phoneNumber"], // Specify which fields are causing the issue
  });
```

With this schema in place, if we were to validate an object of this shape:

```js
const result = contactSchema.safeParse({
  name: "Jimmy",
  surname: "Hopkins",
  sex: "Male",
  yearsOfProficiency: 2,
  birthDate: new Date("1991-04-29"),
});

console.log(result);
```

We would get a nice Validation Error:

```
{
  success: false,
  error: ZodError {
    issues: [
      {
        code: 'custom',
        message: 'You should provide at least either an email or a phone number',
        path: [ 'email', 'phoneNumber' ]
      }
    ]
  }
}
```

#### Password example 🔐

Another example that comes to mind is the one where the user has to enter a password twice as a means of security.

```js
const passwordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
```

Doing that we make sure that the two passwords are exactly the same!

### Profit! 😎

All of that being said, you should now be able to validate a complex-shaped object with ease.

If you are using React, you might want to try [Formik](https://formik.org/) or [React Hook Form](https://react-hook-form.com/).
These two libraries are going to make your life so much easier while building forms, and they support using Zod as a schema validator!

That's all for this post, see you in the next one!

Happy hacking until then! 👨‍💻

[1]: https://en.wikipedia.org/wiki/Data_validation
