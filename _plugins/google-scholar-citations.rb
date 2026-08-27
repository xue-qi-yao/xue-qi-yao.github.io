require "active_support/all"
require "nokogiri"
require "open-uri"
require "yaml"

# Google Scholar citation counts.
#
# Fetching happens in a Generator rather than in the Liquid tag because the count
# also drives ordering: jekyll-scholar sorts the bibliography before any tag is
# rendered, so a count fetched at render time would always be one build stale.
# The generator writes the count into the .bib as a zero-padded `citation_sort`
# field (jekyll-scholar compares field values as strings, so "7" would otherwise
# sort above "84") and the tag just reads what was already fetched.
#
# Scholar refuses requests from datacenter IP ranges, so the fetch reliably fails
# on GitHub Actions runners. Successful counts are persisted to
# _data/scholar_citations.yml and used as the fallback, which is what keeps the
# deployed badges showing real numbers instead of "N/A". Refresh them by building
# locally and committing the updated cache and .bib.
module Jekyll
  module ScholarCitations
    CACHE_FILE = "_data/scholar_citations.yml".freeze
    BIB_FILE = "_bibliography/papers.bib".freeze

    CACHE_HEADER = <<~HEADER.freeze
      # Google Scholar citation counts, cached by _plugins/google-scholar-citations.rb.
      #
      # Scholar blocks datacenter IPs, so CI cannot fetch these. This file is the
      # fallback that keeps the deployed badges showing real numbers. It is rewritten
      # automatically whenever a build DOES reach Scholar (i.e. when you build
      # locally) - commit the change to publish the updated counts.
    HEADER

    class << self
      # key ("<user>:<article>") => Integer
      def counts
        @counts ||= {}
      end

      def cache
        @cache ||= begin
          File.exist?(CACHE_FILE) ? (YAML.safe_load(File.read(CACHE_FILE)) || {}) : {}
        rescue StandardError
          {}
        end
      end

      def humanize(count)
        ActiveSupport::NumberHelper.number_to_human(
          count,
          :format => "%n%u", :precision => 2,
          :units => { :thousand => "K", :million => "M", :billion => "B" }
        )
      end

      def fetch(scholar_id, key)
        url = "https://scholar.google.com/citations?view_op=view_citation&hl=en" \
              "&user=#{scholar_id}&citation_for_view=#{key}"

        sleep(rand(1.5..3.5)) # Scholar throttles aggressively
        doc = Nokogiri::HTML(URI.open(url, "User-Agent" => "Ruby/#{RUBY_VERSION}",
                                           :read_timeout => 15, :open_timeout => 15).read)
        meta = doc.css('meta[name="description"]').first ||
               doc.css('meta[property="og:description"]').first
        # The meta tag is the proof the page loaded. Scholar simply omits "Cited by"
        # for a paper with no citations yet, which is a 0, not a failure.
        raise "citation page did not load" unless meta

        matched = meta["content"].to_s.match(/Cited by (\d+[,\d]*)/)
        matched ? matched[1].delete(",").to_i : 0
      end

      def write_cache!
        payload = counts.sort.to_h.transform_values(&:to_s)
        return if payload == cache

        File.write(CACHE_FILE, CACHE_HEADER + payload.to_yaml)
        @cache = payload
      rescue StandardError => e
        Jekyll.logger.warn "Scholar citations:", "could not write #{CACHE_FILE} (#{e.message})"
      end

      # Keeps a zero-padded sort key next to each google_scholar_id so that
      # {% bibliography --sort_by citation_sort %} orders by citations.
      def write_sort_keys!
        return unless File.exist?(BIB_FILE)

        src = File.read(BIB_FILE)
        out = src.gsub(/^([ \t]*)google_scholar_id=\{([^}]+)\},\n(?:[ \t]*citation_sort=\{[^}]*\},\n)?/) do
          indent = Regexp.last_match(1)
          key = Regexp.last_match(2)
          count = counts[key]
          sort_line = count ? format("%<indent>scitation_sort={%<count>06d},\n", :indent => indent, :count => count) : ""
          "#{indent}google_scholar_id={#{key}},\n#{sort_line}"
        end

        File.write(BIB_FILE, out) unless out == src
      rescue StandardError => e
        Jekyll.logger.warn "Scholar citations:", "could not update #{BIB_FILE} (#{e.message})"
      end
    end
  end

  class ScholarCitationsGenerator < Generator
    safe true
    priority :highest

    def generate(site)
      # Tolerate an id pasted straight out of a profile URL (e.g. "ABC123&hl=en").
      scholar_id = site.data.dig("socials", "scholar_userid").to_s.split("&").first
      return if scholar_id.nil? || scholar_id.empty?
      return unless File.exist?(ScholarCitations::BIB_FILE)

      keys = File.read(ScholarCitations::BIB_FILE).scan(/google_scholar_id=\{([^}]+)\}/).flatten.uniq
      return if keys.empty?

      keys.each do |key|
        lookup = key.include?(":") ? key : "#{scholar_id}:#{key}"
        begin
          ScholarCitations.counts[key] = ScholarCitations.fetch(scholar_id, lookup)
        rescue StandardError => e
          cached = ScholarCitations.cache[key]
          if cached
            Jekyll.logger.info "Scholar citations:", "#{key} unreachable (#{e.class}), using cached #{cached}"
            ScholarCitations.counts[key] = cached.to_i
          else
            Jekyll.logger.warn "Scholar citations:", "#{key} unreachable (#{e.class}) and not cached"
          end
        end
      end

      ScholarCitations.write_cache!
      ScholarCitations.write_sort_keys!
    end
  end

  class GoogleScholarCitationsTag < Liquid::Tag
    def initialize(tag_name, params, tokens)
      super
      splitted = params.split(" ").map(&:strip)
      @scholar_id = splitted[0]
      @article_id = splitted[1]
    end

    def render(context)
      scholar_id = context[@scholar_id.to_s.strip].to_s.split("&").first
      article_id = context[@article_id.to_s.strip].to_s
      key = article_id.include?(":") ? article_id : "#{scholar_id}:#{article_id}"

      count = ScholarCitations.counts[key] || ScholarCitations.cache[key]&.to_i
      count.nil? ? "N/A" : ScholarCitations.humanize(count)
    end
  end
end

Liquid::Template.register_tag("google_scholar_citations", Jekyll::GoogleScholarCitationsTag)
