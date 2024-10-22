---
layout: post
title: "Some Useful Tips And Tricks About Form Validation in JavaScript"
tags: tutorial webdev javascript
image: /img/posts/yup.png
typewriter-delay: 20
---
As time goes by, sooner or later, every developer has been tasked with building a form. 🛠️

Well, as far as I'm concerned, that's not one of the funniest things to do. 😅

But it turns out that even the simpler of websites out there is going to need at least a basic contact form. 🤷‍♂️

And, sometimes, there are cases where you are building a really complex and big application with forms everywhere. 🤓

They might be so big that you have to split them into multiple steps! 😮

But, in this post, I'm not going to show you a specific way of building a form nor how to split it into multiple steps, for example.

I'm going to try to be framework agnostic as well, but I might use a couple of lines of `React` here and there, as that's what I mostly use day by day.

Anyway, I promise you that this will not retain you from using what I will show you in any other framework you might happen to use or even [Vanilla JS](http://vanilla-js.com/)!

Well, at this point you may be wondering what I'm precisely going to talk about, then? 🧐

## Data Validation ✅/❌

> In computer science, data validation is the process of ensuring data have undergone data cleansing to ensure they have data quality, that is, that they are both correct and useful.
>
> -- <cite>[Wikipedia][1]</cite>

To my advice, one of the most important task we have while building a form is to ensure that the data is proactively validated.

Of course, there MUST be validation on the backend as well, that's mandatory. ☝️

Never validate data only on the front-end! This might be dangerous. ☢️

But, actually, the real reason why you should do that, is to preserve the mental health of your user. Really! 😂

As a matter of fact, as a user, I often run into long and/or complex and evil form that gives no hint to me about what I should do next or if the data that I provided is correct. 😈

These are some question that I'm sure even you had while filling-out this kind of forms:

1) Is there life on mars? 👽
2) Will the code I wrote yesterday compile? 🤔
3) But most importantly... Why the hell is the f**** submit button disabled?!? 🤬

Well, to be honest sometimes happens that the submit button is ALWAYS enabled (really?). 😶

As a developer, I strive to do my best to avoid these frustrating situations.

If only we could make the user “fail fast, fail often”...

What if I told you we can accomplish this task easily?

## Yup to the rescue 🚑

> Yup is a JavaScript object schema validator and object parser.
  -- <cite>[Yup GitHub Page](https://github.com/jquense/yup)</cite>

### Install

```shell
yarn add yup
```

If you are using `TypeScript` you should install `@types` as well.

```shell
yarn add -D @types/yup
```

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

All of the fields are required but `Sex` and `Phone Number`.

We should end up writing this schema with `Yup`:

```js
Yup.object({
  name: Yup.string().required(),
  surname: Yup.string().required(),
  birthDate: Yup.date().required(),
  sex: Yup.mixed().oneOf(['Male', 'Female']),
  yearsOfProficiency: Yup.number().positive().required("Don't be shy!"),
  email: Yup.string().email().required(),
  phoneNumber: Yup.string(),
  portfolio: Yup.string().url()
})
```

Straightforward, right?

But, what if we want to make a property required based on the value of another field?

Let's say that we would like to be able to contact the user in some way: we don't care if by email or by calling them.

Thereafter, we have to make sure that at least the email OR the phone is provided.

Well, that's easily done with this schema:

```js
Yup.object({
  name: Yup.string().required(),
  surname: Yup.string().required(),
  birthDate: Yup.date().required(),
  sex: Yup.mixed().oneOf(["Male", "Female"]),
  yearsOfProficiency: Yup.number()
    .positive()
    .required("Don't be shy!"),
  email: Yup.string()
    .email(),
  phoneNumber: Yup.string()
    .test(
      "at-least-email-or-phone-number",
      "You should provide at least either an email or a phone number",
      function(value) {
        const email = this.parent.email;

        if (!email || value ? .length === 0) {
          return false;
        }

        return true;
      }
    ),
  portfolio: Yup.string().url()
})

```

Whit this schema in place, if we were to validate an object of this shape:

```js
{
  name: 'Jimmy',
  surname: 'Hopkins',
  sex: 'Male',
  age: 28,
  yearsOfProficiency: 2,
  birthDate: '1991-04-29T22:00:00.000Z'
}
```

We would get a nice Validation Error:

```
ValidationError: You should provide at least either an email or a phone number
```

#### Password example 🔐

Another example that came to my mind is the one where the user has to enter a password twice as a mean of security.

```js
Yup.object({
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Passwords must match")
    .required('Password confirm is required')
})
```

Doing that we make sure that the two passwords are exactly the same!

### Profit! 😎

All of that being said, you should be now able to validate a complex shaped object with ease.

If you are using React, you might want to try [Formik](https://jaredpalmer.com/formik/) or [React Hook Form](https://react-hook-form.com/).
These two libraries are going to make your life so much easier while building forms, and leverage the possibility to use Yup as a schema validator!

That's all for this post, see you next one!

Happy hacking until then! 👨‍💻

[1]:https://en.wikipedia.org/wiki/Data_validation
