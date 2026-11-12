import type { SiteBrand } from "@anthusai/papyrus/lib/site-brand";
import { DEFAULT_THEME_PACK_TOKENS } from "@anthusai/papyrus/lib/site-stack";

// TODO(HUM-1be843): neutral placeholder. Replace with the neutral theme work.
// Names and labels here are site settings; editorial text is backend data.
export const theHallucinatorBrand: SiteBrand = {
  id: "the-hallucinator",
  appTitle: "TheHallucinator.ai",
  appDescription: "Satire. Everything on this site is invented.",
  mastheadTitle: "TheHallucinator.ai",
  mastheadSubtitle: "Satire",
  backToHomeLabel: "Back to TheHallucinator.ai",
  articleTitleSuffix: "TheHallucinator.ai",
  placeholderByline: "TheHallucinator.ai",
  defaultPresentation: "blog",
  forcedPresentation: "blog",
  textFont: 'Georgia, "Times New Roman", serif',
  mastheadWordSplit: false,
  mastheadDateFormat: "raw",
  mastheadSource: "brand",
  sectionLinkStrategy: "route",
  themePack: "papyrus",
  // Placeholder palette: paper, ink and two accents. Meaning is never carried
  // by colour alone (labels and marks always accompany it).
  themeTokens: { ...DEFAULT_THEME_PACK_TOKENS },
  kanbusTheme: "newspaper-gothic",
  renderer: { kind: "pretext" },
  hosting: { kind: "amplify-ssr" },
  opsChrome: "app",
  corpusKey: "the-hallucinator",
  publicationName: "TheHallucinator.ai",
  editions: { enabled: false },
};
