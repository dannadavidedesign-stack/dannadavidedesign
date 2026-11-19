// Use the public project ID and dataset from Sanity Manage. Leave the ID empty
// while Sanity is unconfigured. The public site does not use an API token.
const sanitySettings = {
    projectId: '',
    dataset: 'production'
};

const sanityProjects = '*[_type == "portfolioProject" && defined(slug.current)]';
const projectOrder = '| order(coalesce(sortOrder, 1000) asc, year desc, title asc)';
const projectFields = `
    "slug": slug.current,
    title,
    category,
    year,
    description,
    "short_description": summary
`;
const imageFields = `
    "url": asset->url,
    "thumbnail_url": asset->url + "?w=960&fit=max&auto=format",
    "alt_text": altText,
    caption
`;

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Richiesta non riuscita (${response.status})`);
    return response.json();
}

async function querySanity(query, slug) {
    const { projectId, dataset } = sanitySettings;
    const url = new URL(`https://${projectId}.apicdn.sanity.io/v2025-02-19/data/query/${encodeURIComponent(dataset)}`);
    url.searchParams.set('query', query);
    url.searchParams.set('perspective', 'published');
    if (slug !== undefined) url.searchParams.set('$slug', JSON.stringify(slug));

    const data = await fetchJson(url);
    return data.result;
}

function usingLegacyProjectApi() {
    return !sanitySettings.projectId && window.API_BASE != null;
}

function projectPageUrl(slug) {
    const encodedSlug = encodeURIComponent(slug);
    if (usingLegacyProjectApi()) return `${window.BASE_PATH || ''}/progetti/${encodedSlug}`;
    return `project.html?slug=${encodedSlug}`;
}

async function fetchProjects() {
    if (sanitySettings.projectId) {
        return querySanity(`${sanityProjects} ${projectOrder} {
            ${projectFields},
            "images": images[defined(asset->url)][0...1] { ${imageFields} }
        }`);
    }

    if (usingLegacyProjectApi()) return fetchJson(window.API_BASE + '/api/projects');
    return [];
}

async function fetchProject(slug) {
    if (sanitySettings.projectId) {
        return querySanity(`${sanityProjects}[slug.current == $slug][0] {
            ${projectFields},
            "images": images[defined(asset->url)] { ${imageFields} }
        }`, slug);
    }

    if (!usingLegacyProjectApi()) return null;

    const response = await fetch(window.API_BASE + '/api/projects/by-slug/' + encodeURIComponent(slug));
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Richiesta non riuscita (${response.status})`);
    return response.json();
}
