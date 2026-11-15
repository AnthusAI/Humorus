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
    // The public site is static pages in a site bucket behind a CloudFront distribution that this backend creates.
    // It answers the apex and sends www to the apex; its certificate and alias records are made here, in the site's
    // zone. The newsroom console is a separate host on the Amplify app (infra/site.json). Look and wording come from
    // the site folder.
    publication: {
      kind: "s3-projection",
      staticDir: "sites/the-hallucinator",
      reprojectOnDeploy: true,
      distribution: {
        create: true,
        aliases: ["thehallucinator.ai", "www.thehallucinator.ai"],
        acm: { hostedZoneId: "Z0800237UHBR8HFBQZ35", hostedZoneName: "thehallucinator.ai" },
        dnsRecords: true,
        wwwRedirect: true,
      },
    },
  },
});
