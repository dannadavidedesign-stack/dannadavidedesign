/* ============================================
   DAVIDE D'ANNA — Project detail page logic
   ============================================= */

function projectSlug() {
    const slug = new URLSearchParams(window.location.search).get('slug');
    if (slug) return slug;

    const legacyRoute = window.location.pathname.match(/\/progetti\/([^/]+)\/?$/);
    return legacyRoute ? decodeURIComponent(legacyRoute[1]) : '';
}

function imgSrc(img) {
    return img.thumbnail_url || img.url;
}

function captionHtml(project, img, i) {
    const parts = [];
    if (img.alt_text) parts.push(escapeHtml(img.alt_text));
    if (img.caption) parts.push(escapeHtml(img.caption));
    if (!parts.length && project.title) parts.push(escapeHtml(project.title) + ' — ' + (i + 1));
    return parts.length ? parts.join(' · ') : '';
}

function renderProject(project, relatedProjects) {
    const root = document.getElementById('project-shell');
    if (!root) return;

    root.innerHTML = `
    <article class="project-page">
        <div class="container project-header">
            <a href="/#work" class="back-link">← Torna al portfolio</a>
            <p class="section-label">${escapeHtml(project.category || 'Progetto')}</p>
            <h1 class="project-title">${escapeHtml(project.title)}</h1>
            ${project.year ? `<p class="project-year">${escapeHtml(project.year)}</p>` : ''}
        </div>

        ${project.description ? `
        <div class="container project-description">
            <div class="project-desc-text reveal-up">${escapeHtml(project.description).replace(/\n/g, '<br>')}</div>
        </div>` : ''}

        <div class="container project-gallery-wrap">
            <div class="project-gallery" id="project-gallery"></div>
        </div>

        <nav class="project-nav" id="project-nav"></nav>
    </article>`;

    const shell = root;
    shell.classList.add('ready');
    observeReveals(shell);
    shell.querySelectorAll('.hidden').forEach(s => s.classList.add('visible'));

    const gallery = document.getElementById('project-gallery');
    const images = (project.images || []).slice();

    if (images.length === 0) {
        gallery.innerHTML = '<p class="project-no-images">Al momento non sono disponibili immagini per questo progetto.</p>';
    } else {
        images.forEach((img, i) => {
            const figure = document.createElement('figure');
            figure.className = 'project-gallery-item';
            figure.innerHTML = `
                <img src="${escapeHtml(imgSrc(img))}" alt="${escapeHtml(img.alt_text || project.title)}" loading="lazy" data-full="${escapeHtml(img.url || img.thumbnail_url)}">
                <figcaption>${captionHtml(project, img, i)}</figcaption>`;
            figure.addEventListener('click', () => openLightbox(images, i));
            gallery.appendChild(figure);
        });
    }

    // Prev / next
    const nav = document.getElementById('project-nav');
    if (nav && relatedProjects.length > 1) {
        const all = relatedProjects;
        const i = all.findIndex(p => p.slug === project.slug);
        if (i === -1) return;
        const prev = all[(i - 1 + all.length) % all.length];
        const next = all[(i + 1) % all.length];
        nav.innerHTML = `
            <a class="project-nav-item project-nav-prev" href="${portfolio.projectPageUrl(prev.slug)}">
                <span>&larr; Precedente</span>
                <strong>${escapeHtml(prev.title)}</strong>
            </a>
            <a class="project-nav-item project-nav-next" href="${portfolio.projectPageUrl(next.slug)}">
                <span>Successivo &rarr;</span>
                <strong>${escapeHtml(next.title)}</strong>
            </a>`;
    }
}

// ---- LIGHTBOX ----
let lightboxIndex = 0;
let lightboxImages = [];

function openLightbox(images, start) {
    lightboxImages = images;
    lightboxIndex = start;
    document.getElementById('lightbox').classList.add('open');
    updateLightbox();
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
    lightboxImages = [];
}

function stepLightbox(dir) {
    if (!lightboxImages.length) return;
    lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
    updateLightbox();
}

function updateLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb || lightboxIndex >= lightboxImages.length) return;
    const img = lightboxImages[lightboxIndex];
    lb.querySelector('img').src = img.url || img.thumbnail_url;
    lb.querySelector('img').alt = img.alt_text || '';
    lb.querySelector('.lightbox-caption').textContent =
        `${lightboxIndex + 1} / ${lightboxImages.length}${img.caption ? ' — ' + img.caption : ''}`;
    lb.querySelector('.lightbox-counter').textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

function initLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;

    lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox-prev').addEventListener('click', () => stepLightbox(-1));
    lb.querySelector('.lightbox-next').addEventListener('click', () => stepLightbox(1));

    lb.addEventListener('click', (e) => {
        if (e.target === lb) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') stepLightbox(-1);
        if (e.key === 'ArrowRight') stepLightbox(1);
    });
}

const siteUrl = 'https://davidedanna.com';

function setMeta(attribute, key, content) {
    let meta = document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
    }
    meta.content = content;
}

function setProjectMetadata(project) {
    const { seo } = project;
    const title = seo.title || project.title + ' — Davide D’Anna Design Solutions';
    const description = (seo.description || project.short_description || project.description || '')
        .replace(/\s+/g, ' ').trim();
    const url = new URL(portfolio.projectPageUrl(project.slug), siteUrl).href;

    document.title = title;
    setMeta('property', 'og:title', seo.ogTitle || title);
    if (description) setMeta('name', 'description', description);
    if (seo.ogDescription || description) {
        setMeta('property', 'og:description', seo.ogDescription || description);
    }
    if (seo.ogImage) {
        setMeta('property', 'og:image', seo.ogImage);
        setMeta('property', 'og:image:alt', seo.imageAlt);
    }
    setMeta('property', 'og:url', url);
    if (seo.noIndex === true) setMeta('name', 'robots', 'noindex, follow');

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = url;
    document.head.appendChild(canonical);
}

// ---- LOAD ----
async function loadProjectPage() {
    try {
        const slug = projectSlug();
        const project = slug ? await portfolio.fetchProject(slug) : null;
        if (!project) {
            setMeta('name', 'robots', 'noindex, follow');
            showNotFound();
            return;
        }

        setProjectMetadata(project);
        renderProject(project, project.relatedProjects);
    } catch {
        showLoadError();
    }
}

function showNotFound() {
    const root = document.getElementById('project-shell');
    root.innerHTML = `
        <div class="container project-error">
            <p class="section-label">404</p>
            <h1>Progetto non trovato</h1>
            <p>Il progetto che cerchi non esiste o non è più pubblicato.</p>
            <a href="/#work" class="contact-email" data-magnetic>
                <span>Torna al portfolio</span>
            </a>
        </div>`;
}

function showLoadError() {
    const root = document.getElementById('project-shell');
    root.innerHTML = `
        <div class="container project-error">
            <p class="section-label">Errore</p>
            <h1>Impossibile caricare il progetto</h1>
            <a href="/#work" class="contact-email" data-magnetic>
                <span>Torna al portfolio</span>
            </a>
        </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    initLightbox();
    loadProjectPage();
});
