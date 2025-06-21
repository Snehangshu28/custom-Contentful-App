# Contentful Visual Editor – Fullstack Task

This project is a fullstack solution for visually managing landing page layouts in Contentful and rendering them with a Next.js frontend.

## Project Structure

- `contentful-app/` – A React + Vite app for Contentful UI Extensions, providing a drag-and-drop layout editor for landing pages.
- `next-frontend/` – A Next.js 15 app that fetches landing page data from Contentful and renders dynamic pages based on the layout configuration.

---

## 1. Contentful Visual Editor (`contentful-app/`)

A Contentful App Extension that allows editors to visually build and reorder landing page layouts using drag-and-drop. It supports adding new components (Hero Block, Two Column Row, Image Grid), undo/redo, and persists layout to the `layoutConfig` field of a Contentful entry.

### Features

- Drag-and-drop layout editing with undo/redo.
- Add new components (creates Contentful entries).
- Persists layout to Contentful.
- Built with React, Redux Toolkit, and @hello-pangea/dnd.

### Development

```sh
cd contentful-app
npm install
npm run dev
```

Open the local app in Contentful as a UI Extension.

---

## 2. Next.js Frontend (`next-frontend/`)

A Next.js app that fetches landing page data and layout from Contentful using GraphQL, then renders the page using mapped React components.

### Features

- Dynamic route for `/landing/[slug]` pages.
- Fetches layout and component data from Contentful.
- Renders components in the order specified by the layout editor.
- SEO metadata and OpenGraph support.
- Styled with CSS Modules.

### Development

```sh
cd next-frontend
npm install
npm run dev
```

Visit [http://localhost:3000/landing/page-1](http://localhost:3000/landing/page-1) (or another slug) to see a landing page.

#### Environment Variables

Create a `.env.local` file in `next-frontend/` with:

```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
```

---

## Learn More

- [Contentful App Framework](https://www.contentful.com/developers/docs/extensibility/app-framework/)
- [Next.js Documentation](https://nextjs.org/docs)
# custom-Contentful-App
