/**
 * Site-wide bilingual (zh / en) helpers.
 *
 * Reads the visitor's preferred language from a cookie. Default = "zh"
 * because the primary audience is Tzu Chi University students.
 *
 * Used by Base.astro and any page that has hardcoded UI strings.
 */
import type { AstroGlobal } from "astro";

export type Lang = "zh" | "en";

const COOKIE = "emdash-lang";
const DEFAULT: Lang = "zh";

/** Read the cookie. Falls back to default when missing or invalid. */
export function getLang(Astro: AstroGlobal): Lang {
	const v = Astro.cookies.get(COOKIE)?.value;
	if (v === "zh" || v === "en") return v;
	return DEFAULT;
}

/** Bilingual UI labels. Keep keys flat; add new keys as needed. */
export const LABELS = {
	zh: {
		// Header / nav
		home: "首頁",
		about: "關於",
		posts: "文章",
		lessons: "課程",
		search_placeholder: "搜尋…",
		admin: "管理",

		// Footer
		footer_navigate: "導覽",
		footer_connect: "聯繫",
		footer_all_posts: "所有文章",
		footer_rss: "RSS 訂閱",
		footer_powered_by: "由",
		footer_powered_by_suffix: "驅動",

		// Theme
		theme_light: "亮色模式",
		theme_dark: "暗色模式",
		theme_system: "系統",

		// Lang switcher
		lang_label: "語言",
		lang_zh: "繁中",
		lang_en: "English",

		// Pages
		all_posts_title: "所有文章",
		all_posts_desc: "瀏覽所有文章",
		lessons_title: "Vibe Coding 教學課程",
		lessons_desc: "慈濟大學資訊科技與管理學系 · Vibe Coding 實機課程教材",
		lessons_dogfood:
			"EmDash CMS dogfooding：用 EmDash 自己呈現「如何學 EmDash」",
		lessons_phase: "階段",
		lessons_back: "← 回課程列表",
		lessons_no_content: "本階段尚未提供繁體中文版，請切換到 English 閱讀。",
		switch_to_other: "切換英文版本",

		// Common
		read_more: "繼續閱讀",
	},
	en: {
		home: "Home",
		about: "About",
		posts: "Posts",
		lessons: "Lessons",
		search_placeholder: "Search…",
		admin: "Admin",

		footer_navigate: "Navigate",
		footer_connect: "Connect",
		footer_all_posts: "All Posts",
		footer_rss: "RSS Feed",
		footer_powered_by: "Powered by",
		footer_powered_by_suffix: "",

		theme_light: "Light mode",
		theme_dark: "Dark mode",
		theme_system: "System theme",

		lang_label: "Language",
		lang_zh: "繁中",
		lang_en: "English",

		all_posts_title: "All Posts",
		all_posts_desc: "Browse all blog posts",
		lessons_title: "Vibe Coding Lesson Series",
		lessons_desc:
			"Tzu Chi University · Department of Information Technology & Management — Senior Vibe Coding Lab",
		lessons_dogfood:
			"EmDash CMS dogfooding: EmDash itself presents \"how to learn EmDash\"",
		lessons_phase: "Phase",
		lessons_back: "← Back to lessons",
		lessons_no_content:
			"This phase has no English version yet — please switch to 繁中.",
		switch_to_other: "Switch to Chinese",

		read_more: "Read more",
	},
} as const satisfies Record<Lang, Record<string, string>>;

/**
 * Translate a single menu label.
 *
 * The DB stores English/legacy labels (Home / About / Posts / Lessons).
 * We map by case-insensitive English label so editors can keep editing
 * one DB row and the UI auto-localises.
 */
export function localizeMenuLabel(rawLabel: string, lang: Lang): string {
	const map: Record<string, keyof (typeof LABELS)["zh"]> = {
		home: "home",
		about: "about",
		posts: "posts",
		lessons: "lessons",
	};
	const key = map[rawLabel.trim().toLowerCase()];
	return key ? LABELS[lang][key] : rawLabel;
}
