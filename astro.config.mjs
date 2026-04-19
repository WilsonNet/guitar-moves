// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

export default defineConfig({
	site: 'https://WilsonNet.github.io',
	base: '/guitar-moves',
	integrations: [
		react(),
		starlight({
			title: 'Guitar Moves',
			social: [],
			customCss: ['./src/styles/custom.css'],
			head: [
				{
					tag: 'script',
					content: `localStorage.setItem('starlight-theme','dark');document.documentElement.setAttribute('data-theme','dark');`,
				},
				{
					tag: 'link',
					attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.gstatic.com',
						crossorigin: '',
					},
				},
			],
			sidebar: [
				{
					label: 'Theory',
					items: [
						{ label: 'Intervals', slug: 'intervals' },
					],
				},
			],
		}),
	],
});
