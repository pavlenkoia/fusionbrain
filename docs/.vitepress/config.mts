import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
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
		// returnToTop: 'Вернуться к началу',
		// toggleSidebar: 'Переключить боковую панель',
		docFooter: {
			prev: "Предыдущая страница",
			next: "Следующая страница",
		},
	},
});
