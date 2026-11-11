// Releases are cut from main only. Nothing is published to a package registry:
// the version tag and the GitHub release (whose notes are the changelog) are
// the whole output. Only GITHUB_TOKEN is used.
module.exports = {
  branches: ["main"],
  plugins: [
    ["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
    ["@semantic-release/release-notes-generator", { preset: "conventionalcommits" }],
    "@semantic-release/github",
  ],
};
