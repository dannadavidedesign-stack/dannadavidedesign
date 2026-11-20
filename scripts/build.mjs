import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';

const pages = ['index.html', 'project.html'];
const output = 'public';
await mkdir(output, { recursive: true });
await Promise.all([...pages, 'assets', 'css', 'js'].map(path =>
    cp(path, `${output}/${path}`, { recursive: true })
));

await build({
    entryPoints: ['js/project-data.js'],
    outfile: `${output}/js/project-data.js`,
    bundle: true,
    format: 'iife',
    globalName: 'portfolio',
    minify: true,
    target: ['es2020']
});

const assets = new Map();
for (const [dir, extension] of [['css', '.css'], ['js', '.js']]) {
    for (const file of await readdir(dir)) {
        if (!file.endsWith(extension)) continue;

        const source = `${dir}/${file}`;
        const cssOrJs = await readFile(`${output}/${source}`);
        const digest = createHash('sha256').update(cssOrJs).digest('hex').slice(0, 16);
        assets.set(source, digest);
    }
}

for (const page of pages) {
    const path = `${output}/${page}`;
    let html = await readFile(path, 'utf8');
    for (const [asset, digest] of assets) {
        html = html.replaceAll(`"/${asset}"`, `"/${asset}?v=${digest}"`);
    }
    await writeFile(path, html);
}
