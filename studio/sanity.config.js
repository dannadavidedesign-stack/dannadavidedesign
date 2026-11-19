import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { portfolioProject } from './schemaTypes/portfolioProject.js';

export default defineConfig({
    name: 'davidedanna',
    title: 'Davide D’Anna Design Solutions',
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
    plugins: [structureTool()],
    schema: { types: [portfolioProject] }
});
