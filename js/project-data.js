import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const client = createClient({
    projectId: 'fttl92eh',
    dataset: 'production',
    apiVersion: '2025-02-19',
    perspective: 'published',
    useCdn: true,
    withCredentials: false
});

const imageBuilder = createImageUrlBuilder(client);
const projects = '*[_type == "project" && defined(slug.current) && defined(title)]';
const projectOrder = '| order(coalesce(order, 2147483647) asc, year desc, title asc)';
const projectFields = '"slug": slug.current, title, category, year';
const imageFields = `"source": image{asset, crop, hotspot}, "alt_text": alt, caption`;
const coverField = `
    "cover": select(
        defined(cover.image.asset->_id) => cover,
        gallery[defined(image.asset->_id)][0]
    ){${imageFields}}
`;

export function projectPageUrl(slug) {
    return '/project.html?' + new URLSearchParams({ slug }).toString();
}

function projectImage(image) {
    const builder = imageBuilder.image(image.source).fit('max').auto('format');
    return {
        url: builder.width(1920).url(),
        thumbnail_url: builder.width(960).url(),
        alt_text: image.alt_text,
        caption: image.caption
    };
}

export async function fetchProjects() {
    const results = await client.fetch(`
        ${projects} ${projectOrder} {
            ${projectFields},
            "short_description": description,
            ${coverField}
        }
    `);

    return results.map(({ cover, ...project }) => ({
        ...project,
        images: cover ? [projectImage(cover)] : []
    }));
}

export async function fetchProject(slug) {
    const { project, relatedProjects } = await client.fetch(`{
        "project": ${projects}[slug.current == $slug][0] {
            ${projectFields},
            "short_description": description,
            "description": coalesce(pt::text(body), description),
            ${coverField},
            "gallery": gallery[defined(image.asset->_id)]{${imageFields}},
            seo{
                "title": coalesce(metaTitle, title),
                "description": coalesce(metaDescription, description),
                "ogTitle": coalesce(ogTitle, openGraph.title),
                "ogDescription": coalesce(ogDescription, openGraph.description),
                "image": coalesce(ogImage.image, ogImage, openGraph.image.image, openGraph.image, image){
                    asset, crop, hotspot
                },
                "imageAlt": coalesce(ogImage.alt, openGraph.image.alt, image.alt),
                noIndex
            }
        },
        "relatedProjects": ${projects} ${projectOrder} { "slug": slug.current, title }
    }`, { slug });
    if (!project) return null;

    const { cover, gallery, seo, ...fields } = project;
    const images = [
        ...(cover ? [cover] : []),
        ...(gallery || []).filter(image => image.source.asset._ref !== cover?.source.asset._ref)
    ].map(projectImage);
    const seoImage = seo?.image?.asset ? seo.image : null;
    const shareImage = seoImage || cover?.source;
    const ogImage = shareImage
        ? imageBuilder.image(shareImage).width(1200).height(630).fit('crop').format('jpg').url()
        : '';

    return {
        ...fields,
        images,
        seo: {
            ...seo,
            ogImage,
            imageAlt: (seoImage ? seo.imageAlt : cover?.alt_text) || project.title
        },
        relatedProjects
    };
}
