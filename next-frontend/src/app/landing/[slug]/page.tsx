import { notFound } from 'next/navigation';
import { request } from '@/lib/contentful';
import HeroBlock from '@/components/HeroBlock';
import TwoColumnRow from '@/components/TwoColumnRow';
import ImageGrid from '@/components/ImageGrid';
import { Metadata } from 'next';

// TODO: Create Component-to-Renderer mapping
// TODO: Implement generateMetadata

const LANDING_PAGE_SLUGS_QUERY = `
  query LandingPageSlugs {
    landingPageCollection {
      items {
        slug
      }
    }
  }
`;

type LandingPageSlugsResponse = {
  landingPageCollection: {
    items: {
      slug: string;
    }[];
  };
};

export async function generateStaticParams() {
  const data = await request<LandingPageSlugsResponse>(LANDING_PAGE_SLUGS_QUERY);
  const slugs = data.landingPageCollection.items;

  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

type PageProps = {
  params: {
    slug: string;
  };
};

const LANDING_PAGE_QUERY = `
  query LandingPage($slug: String!) {
    landingPageCollection(where: { slug: $slug }, limit: 1) {
      items {
        title
        layoutConfig
      }
    }
  }
`;

const PAGE_COMPONENTS_QUERY = `
  query PageComponents($ids: [String!]!) {
    heroBlockCollection(where: { sys: { id_in: $ids } }) {
      items {
        sys { id }
        heading
        subtitle
        cta
        backgroundImage { url width height }
      }
    }
    twoColumnRowCollection(where: { sys: { id_in: $ids } }) {
      items {
        sys { id }
        leftHeading
        leftSubtitle
        leftCta
        rightImage { url width height }
      }
    }
    imageGridCollection(where: { sys: { id_in: $ids } }) {
      items {
        sys { id }
        image1 { url width height }
        image2 { url width height }
        image3 { url width height }
        image4 { url width height }
      }
    }
  }
`;

// Define types for the responses
// (These should be more specific based on your actual data)
type LandingPageData = {
  landingPageCollection: {
    items: {
      title: string;
      layoutConfig: { id: string; type: string; contentId: string; }[];
    }[];
  };
};

type PageComponentData = {
    heroBlockCollection: { items: any[] };
    twoColumnRowCollection: { items: any[] };
    imageGridCollection: { items: any[] };
}

const componentMap = {
  heroBlock: HeroBlock,
  twoColumnRow: TwoColumnRow,
  imageGrid: ImageGrid,
};

// Fetch data for a specific landing page
async function getLandingPage(slug: string) {
  const pageData = await request<LandingPageData>(LANDING_PAGE_QUERY, { slug });
  const page = pageData.landingPageCollection.items[0];

  if (!page) {
    return null;
  }

  const componentIds = page.layoutConfig.map((c) => c.contentId);

  if (componentIds.length === 0) {
    return { ...page, components: [] };
  }

  const componentsData = await request<PageComponentData>(PAGE_COMPONENTS_QUERY, { ids: componentIds });
  
  const allComponents = [
      ...componentsData.heroBlockCollection.items,
      ...componentsData.twoColumnRowCollection.items,
      ...componentsData.imageGridCollection.items,
  ];

  // Map content to the layout order
  const hydratedComponents = page.layoutConfig.map(config => {
      const content = allComponents.find(c => c.sys.id === config.contentId);
      return {
          ...config,
          content,
      }
  });

  return { ...page, components: hydratedComponents };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getLandingPage(params.slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  const metadata: Metadata = {
    title: page.title,
    description: `Learn more about ${page.title} on our amazing landing page.`,
    openGraph: {
        title: page.title,
        description: `Learn more about ${page.title} on our amazing landing page.`,
    },
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    url: `https://your-domain.com/landing/${params.slug}`, // Replace with your actual domain
    description: `Learn more about ${page.title} on our amazing landing page.`,
  };

  return {
      ...metadata,
      other: {
          'script[type="application/ld+json"]': JSON.stringify(jsonLd),
      },
  }
}

export default async function LandingPage({ params }: PageProps) {
  const page = await getLandingPage(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <main>
      {page.components.map((component) => {
        const Component = componentMap[component.type as keyof typeof componentMap];
        if (!Component || !component.content) {
          return <div key={component.id}>Component of type {component.type} is not mapped or has no content.</div>;
        }
        return <Component key={component.id} component={component.content} />;
      })}
    </main>
  );
} 