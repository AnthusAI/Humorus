import { defineSite } from "@anthusai/papyrus/define-site";
import { theHallucinatorBrand } from "./publication/brand";

// Settings only. Editorial identity (mission, sections, guidelines, agent
// instructions) is backend data, edited in the newsroom or with the papyrus
// CLI. Sign-in settings (Cognito domain prefix, OAuth redirect URLs) come from
// the PAPYRUS_* branch variables that infra/site.json sets on the app.
export default defineSite({
  brands: [theHallucinatorBrand],
  defaultBrand: "the-hallucinator",
  backend: {
    brandId: "the-hallucinator",
  },
});
