---
layout: post
title: "⚡️ Next.js Rendering: Static vs Server vs ISR — When & Why"
tags: nextjs javascript tutorial
image: /img/posts/nextjs-rendering-strategies.png
published: false
typewriter-delay: 20
---

Next.js has become the **React framework of choice** for building modern web applications.  
It’s used by companies like Audible, Notion and Nike, and it ships with built‑in optimizations, data‑fetching primitives and advanced routing【288927486510322†L16-L34】.  
This power comes largely from its flexible rendering strategies.  Understanding when to use **Static Site Generation (SSG)**, **Server‑Side Rendering (SSR)** and **Incremental Static Regeneration (ISR)** is key to building fast, SEO‑friendly and scalable sites.

## 🏗️ What Makes Next.js Special?

Next.js isn’t just a thin wrapper around React.  It offers:

- **Data Fetching & Server Actions** – your components can be async and await data, and you can run server code directly【288927486510322†L25-L34】.  
- **Advanced Routing** – file‑based routes with nested layouts and middleware give you fine‑grained control【288927486510322†L31-L34】.  
- **Built‑in Optimizations** – automatic image and font optimization, script splitting and streaming HTML【288927486510322†L27-L39】.  
- **Flexible Rendering** – per‑page choice between SSG, SSR or client‑side rendering, plus ISR for refreshing content【288927486510322†L45-L69】.

These features let you balance developer experience with performance, but they also mean you need to pick the right rendering strategy for each page.

## 🧊 Static Site Generation (SSG)

With SSG the HTML for your page is generated **at build time**.  When you run `next build`, Next.js pre‑renders each page and stores the result on disk.  In production the HTML can be served directly from a CDN, so there’s no per‑request computation.  The Next.js docs describe it succinctly: “If a page uses Static Generation, the page HTML is generated at build time … it can be cached by a CDN”【227713832624139†L513-L659】.

In Next.js you can statically generate pages with or without data.  For data‑driven pages you export an async `getStaticProps` function that fetches data at build time【227713832624139†L541-L584】.  For dynamic routes you add `getStaticPaths` to determine which paths to pre‑render【227713832624139†L589-L653】.  Here’s a simple example:

```js
// pages/posts/[id].js
export default function Post({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}

// Fetch data at build time
export async function getStaticProps({ params }) {
  const res = await fetch(`https://example.com/posts/${params.id}`);
  const post = await res.json();
  return { props: { post } };
}

// Define which routes to pre‑render
export async function getStaticPaths() {
  const res = await fetch('https://example.com/posts');
  const posts = await res.json();
  const paths = posts.map((p) => ({ params: { id: String(p.id) } }));
  return { paths, fallback: false };
}
```

### ✅ When to Use SSG

Use Static Site Generation when your content can be pre‑rendered ahead of time.  Blog posts, marketing pages, documentation and product listings are good candidates【227713832624139†L657-L666】.  Because HTML is served from a CDN, pages load extremely fast and scale effortlessly.

However, SSG isn’t ideal when your data changes on every request.  If your page shows stock prices, weather information or user‑specific content, you’ll need SSR or client‑side data fetching.

## 🔄 Server‑Side Rendering (SSR)

Server‑side rendering generates HTML **on every request**.  When a user hits your page, Next.js runs an async `getServerSideProps` function to fetch data and assemble the HTML.  The documentation notes: “If a page uses Server‑side Rendering, the page HTML is generated on each request”【392011844697766†L460-L488】.  Here’s what SSR looks like:

```js
// pages/news.js
export default function News({ articles }) {
  return (
    <ul>
      {articles.map((article) => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  );
}

export async function getServerSideProps() {
  const res = await fetch('https://example.com/api/news');
  const articles = await res.json();
  return { props: { articles } };
}
```

Because SSR runs on every request, it’s perfect for pages that depend on user sessions, geolocation or rapidly changing data.  It also avoids the complexity of client‑side fetching, because the data arrives already in the rendered HTML.

### ⚠️ When to Use SSR

Choose SSR when your pages need fresh data on each request.  Examples include dashboards with live metrics, pages that depend on authentication or personalization, or content that updates frequently.  Keep in mind that SSR is slower than SSG because rendering happens on a server for every request, and it doesn’t leverage CDN caching【227713832624139†L657-L673】.  For extremely dynamic pages, combining SSR with client‑side caching (e.g., SWR) can provide a good balance.

## 🔁 Incremental Static Regeneration (ISR)

ISR sits between SSG and SSR.  It allows you to update static pages **after deployment** without rebuilding the entire site.  You pre‑render pages at build time and then configure a `revalidate` interval.  After the interval expires, the next request triggers a regeneration of the page in the background.  Subsequent requests get the updated content.  This gives you the speed of SSG with the freshness of SSR.

Here’s a simplified example:

```js
export async function getStaticProps() {
  const res = await fetch('https://example.com/api/products');
  const products = await res.json();
  return {
    props: { products },
    // Revalidate after 60 seconds
    revalidate: 60,
  };
}
```

ISR is great for pages like product catalogs or news lists where content updates regularly but not on every request.

## 🌐 Client‑Side Rendering and the App Router

While SSG and SSR are handled on the server, you can still fetch data on the client.  Next.js supports **client‑side rendering (CSR)** by default—if you don’t export `getStaticProps`, `getStaticPaths` or `getServerSideProps`, your page becomes a traditional React component that runs entirely in the browser.  You can combine CSR with SSG/SSR by fetching data inside `useEffect` or using libraries like SWR or React Query.

The **App Router** introduced in Next.js 13 further expands your rendering choices.  You can mark components as `use client` or `use server` to control where they run.  React Server Components allow you to write React components that execute on the server and send only serialized props to the client, reducing JavaScript bundle sizes.  For example:

```jsx
// app/page.js (Server Component by default)
import LatestPosts from './LatestPosts';

export default function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      {/* Server Component fetches posts at request time or build time */}
      <LatestPosts />
    </div>
  );
}

// app/LatestPosts.js
'use client';
import useSWR from 'swr';

export default function LatestPosts() {
  const { data, error } = useSWR('/api/posts', fetcher);
  if (error) return <p>Error loading posts</p>;
  if (!data) return <p>Loading…</p>;
  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

This hybrid approach lets you keep expensive data fetching on the server while still enabling interactivity on the client.

## 🛠️ SEO, Caching and Performance Considerations

When choosing a rendering strategy, think about **search engine optimization (SEO)** and performance.  SSG delivers fully rendered HTML that search engines can crawl easily, making it ideal for marketing pages and blogs.  SSR also provides HTML, but because rendering occurs on each request it adds latency.  CSR relies on JavaScript to hydrate the page, which can delay content appearing for users with slow connections.

Caching plays a big role too.  SSG pages can be served from edge locations via CDNs with near‑zero latency.  SSR responses can be cached at the server or edge layer, but cache invalidation is trickier.  ISR strikes a balance by allowing you to cache for a period and regenerate on demand.  Understanding these trade‑offs will help you architect a site that scales without compromising user experience.

## 🧭 Summary and Next Steps

Next.js’s flexible rendering options let you tailor each page to its data requirements.  Beyond SSG and SSR, you can leverage client‑side fetching, server components and incremental regeneration to optimize performance and maintainability.  Experiment with these patterns in your own projects—start by converting a simple page to SSG, then add SSR for dynamic content, and explore the App Router’s ability to mix server and client components.  The more you explore, the more you’ll appreciate how Next.js empowers you to build sophisticated web experiences.

## 📌 Putting It All Together

Choosing the right rendering strategy isn’t about picking one globally—it’s per‑page.  For purely static content, use SSG and benefit from CDN caching【227713832624139†L657-L666】.  For dynamic, user‑specific pages, SSR ensures fresh data at the cost of server overhead【392011844697766†L460-L488】.  ISR gives you a hybrid approach when content updates regularly but not constantly.

Ultimately, **Next.js’s flexibility lets you mix and match**.  Combine SSG for your marketing pages, SSR for your dashboard, and ISR for your blog.  By understanding the trade‑offs, you’ll build fast, scalable and maintainable applications.
