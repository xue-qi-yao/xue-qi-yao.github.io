require "json"
require "open-uri"

# Fetches repository and user metadata from the GitHub REST API at build time and
# exposes it as `site.data.github`.
#
# This replaces the github-readme-stats.vercel.app / github-profile-trophy.vercel.app
# images the theme ships with. Those are third-party free-tier Vercel deployments and
# both are currently down (503 DEPLOYMENT_PAUSED and 402 Payment Required), which took
# the whole /repositories page with them. Rendering the cards ourselves removes the
# runtime dependency entirely.
#
# Set GITHUB_TOKEN (GitHub Actions provides one automatically) to lift the
# 60 requests/hour unauthenticated rate limit.
module Jekyll
  class GitHubMetadataGenerator < Generator
    safe true
    priority :high

    API = "https://api.github.com".freeze

    def generate(site)
      repos = site.data.dig("repositories", "github_repos") || []
      users = site.data.dig("repositories", "github_users") || []

      repo_data = {}
      repos.each do |repo|
        meta = fetch("#{API}/repos/#{repo}")
        repo_data[repo] = meta if meta
      end

      user_data = {}
      users.each do |user|
        meta = fetch("#{API}/users/#{user}")
        next unless meta

        owned = fetch("#{API}/users/#{user}/repos?per_page=100&type=owner")
        meta["total_stars"] = owned.sum { |r| r["stargazers_count"].to_i } if owned.is_a?(Array)
        user_data[user] = meta
      end

      site.data["github"] = { "repos" => repo_data, "users" => user_data }

      missing = repos.reject { |r| repo_data.key?(r) }
      unless missing.empty?
        Jekyll.logger.warn "GitHub metadata:", "no data for #{missing.join(', ')} - cards fall back to a plain link"
      end
    end

    private

    def fetch(url)
      headers = {
        "User-Agent" => "al-folio",
        "Accept" => "application/vnd.github+json",
      }
      token = ENV["GITHUB_TOKEN"] || ENV["GH_TOKEN"]
      headers["Authorization"] = "Bearer #{token}" unless token.nil? || token.empty?

      JSON.parse(URI.open(url, headers).read)
    rescue StandardError => e
      # Never fail the build over a network hiccup or a rate limit.
      Jekyll.logger.warn "GitHub metadata:", "#{url} -> #{e.class}: #{e.message}"
      nil
    end
  end
end
