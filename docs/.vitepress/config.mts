import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	outDir: "../public/docs",
	base: "/docs/",
	lang: "ru-RU",
	title: "Fusionbrain API",
	description: "Fusionbrain API",
	locales: {
		root: {
			label: "Русский",
			lang: "ru",
		},
	},
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config

		nav: [
			// { text: "Home", link: "/" },
			// { text: "Examples", link: "/markdown-examples" },
		],

		sidebar: [
			{
				text: "Документация",
				items: [
					{ text: "Установка", link: "/install" },
					{ text: "API", link: "/api" },
				],
			},
		],

		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/pavlenkoia/fusionbrain",
			},
		],

		lastUpdatedText: "Последнее обновление",
		outlineTitle: "На этой странице",
		docFooter: {
			prev: "Предыдущая страница",
			next: "Следующая страница",
		},
	},
});
