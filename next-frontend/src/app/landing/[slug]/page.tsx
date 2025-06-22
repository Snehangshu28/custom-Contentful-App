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
  try {
    const data = await request<LandingPageSlugsResponse>(LANDING_PAGE_SLUGS_QUERY);
    const slugs = data.landingPageCollection.items;

    return slugs.map((item) => ({
      slug: item.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
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
        sys {
          id
        }
        title
        slug
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
        backgroundImage { 
          url 
          width 
          height 
        }
      }
    }
    twoColumnRowCollection(where: { sys: { id_in: $ids } }) {
      items {
        sys { id }
        leftHeading
        leftSubtitle
        leftCta
        rightImage { 
          url 
          width 
          height 
        }
      }
    }
    imageGridCollection(where: { sys: { id_in: $ids } }) {
      items {
        sys { id }
        image1 { 
          url 
          width 
          height 
        }
        image2 { 
          url 
          width 
          height 
        }
        image3 { 
          url 
          width 
          height 
        }
        image4 { 
          url 
          width 
          height 
        }
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
  heroBlockCollection: { items: Record<string, unknown>[] };
  twoColumnRowCollection: { items: Record<string, unknown>[] };
  imageGridCollection: { items: Record<string, unknown>[] };
}


const componentMap = {
  heroBlock: HeroBlock,
  twoColumnRow: TwoColumnRow,
  imageGrid: ImageGrid,
};

// Fetch data for a specific landing page
async function getLandingPage(slug: string) {
  try {
    console.log('Fetching page for slug:', slug);
    const pageData = await request<LandingPageData>(LANDING_PAGE_QUERY, { slug });
    const page = pageData.landingPageCollection.items[0];

    console.log('Page data:', page);

    if (!page) {
      console.log('No page found for slug:', slug);
      return null;
    }

    const layoutConfig = page.layoutConfig || [];
    console.log('Layout config:', layoutConfig);
    
    const componentIds = layoutConfig.map((c) => c.contentId);
    console.log('Component IDs:', componentIds);

    if (componentIds.length === 0) {
      console.log('No components found, returning empty page');
      return { 
        title: page.title, 
        components: [] 
      };
    }

    const componentsData = await request<PageComponentData>(PAGE_COMPONENTS_QUERY, { ids: componentIds });
    console.log('Components data:', componentsData);
    
    const allComponents = [
        ...componentsData.heroBlockCollection.items,
        ...componentsData.twoColumnRowCollection.items,
        ...componentsData.imageGridCollection.items,
    ];

    const hydratedComponents = layoutConfig.map(config => {
        const content = allComponents.find((c: Record<string, unknown>) => 
          (c.sys as Record<string, unknown>)?.id === config.contentId
        );
        console.log(`Component ${config.type} with ID ${config.contentId}:`, content);
        return {
            ...config,
            content,
        }
    });

    return { 
      title: page.title, 
      components: hydratedComponents 
    };
  } catch (error) {
    console.error('Error fetching landing page:', error);
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
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
      url: `https://your-domain.com/landing/${params.slug}`,
      description: `Learn more about ${page.title} on our amazing landing page.`,
    };

    return {
        ...metadata,
        other: {
            'script[type="application/ld+json"]': JSON.stringify(jsonLd),
        },
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
    };
  }
}

export default async function LandingPage({ params }: PageProps) {
  try {
    const page = await getLandingPage(params.slug);

    if (!page) {
      notFound();
    }

    console.log('Rendering page with components:', page.components.length);

    return (
      <main className="min-h-screen">
        {page.components.length === 0 ? (
          <div className="text-center py-8">
            <p>No components configured for this page.</p>
            <p>Add components in your Contentful layout editor.</p>
          </div>
        ) : (
          page.components.map((component) => {
            const Component = componentMap[component.type as keyof typeof componentMap];
            if (!Component || !component.content) {
              return (
                <div key={component.id} className="p-4 m-4 border border-red-300 bg-red-50 rounded">
                  <p>Component of type <strong>{component.type}</strong> is not mapped or has no content.</p>
                  <p>Component ID: {component.contentId}</p>
                </div>
              );
            }
            return <Component key={component.id} component={component.content} />;
          })
        )}
      </main>
    );
  } catch (error) {
    console.error('Error rendering landing page:', error);
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-600">There was an error loading this page. Please try again later.</p>
        </div>
      </main>
    );
  }
} 