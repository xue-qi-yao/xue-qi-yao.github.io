require "active_support/all"
require "nokogiri"
require "open-uri"
require "yaml"

# Renders the Google Scholar citation count for one publication.
#
# Google Scholar refuses requests from datacenter IP ranges, so the live fetch
# reliably fails on GitHub Actions runners and every badge used to render "N/A"
# on the deployed site while working fine locally. Counts that were fetched
# successfully are therefore persisted to _data/scholar_citations.yml and used as
# the fallback, so a build that cannot reach Scholar still shows real numbers.
#
# Refresh the numbers by building locally (from a residential connection) and
# committing the updated cache file.
module Jekyll
  class GoogleScholarCitationsTag < Liquid::Tag
    CACHE_FILE = "_data/scholar_citations.yml".freeze
    CACHE_HEADER = <<~HEADER
      # Google Scholar citation counts, cached by _plugins/google-scholar-citations.rb.
      #
      # Scholar blocks datacenter IPs, so CI cannot fetch these. This file is the
      # fallback that keeps the deployed badges showing real numbers. It is rewritten
      # automatically whenever a build DOES reach Scholar (i.e. when you build
      # locally) - commit the change to publish the updated counts.
    HEADER

    class << self
      # Shared across tag instances: the badge renders the same count twice (src
      # and alt), and each publication would otherwise be fetched twice, doubling
      # the requests and tripping Scholar's throttle.
      def fetched
        @fetched ||= {}
      end

      def cache
        @cache ||= begin
          File.exist?(CACHE_FILE) ? (YAML.safe_load(File.read(CACHE_FILE)) || {}) : {}
        rescue StandardError
          {}
        end
      end

      # Only ever called with a freshly fetched value, so a blocked build can
      # never overwrite good data with "N/A".
      def remember(key, value)
        return if cache[key] == value

        cache[key] = value
        File.write(CACHE_FILE, CACHE_HEADER + cache.sort.to_h.to_yaml)
      rescue StandardError => e
        Jekyll.logger.warn "Scholar citations:", "could not write #{CACHE_FILE} (#{e.message})"
      end
    end

    def initialize(tag_name, params, tokens)
      super
      splitted = params.split(" ").map(&:strip)
      @scholar_id = splitted[0]
      @article_id = splitted[1]
    end

    def render(context)
      scholar_id = context[@scholar_id.to_s.strip].to_s.split("&").first
      article_id = context[@article_id.to_s.strip].to_s

      # `google_scholar_id` in the .bib may hold either the bare article id or the
      # full "<user>:<article>" form that citation_for_view expects.
      key = article_id.include?(":") ? article_id : "#{scholar_id}:#{article_id}"
      memo = self.class.fetched[key]
      return memo if memo

      url = "https://scholar.google.com/citations?view_op=view_citation&hl=en" \
            "&user=#{scholar_id}&citation_for_view=#{key}"

      count =
        begin
          sleep(rand(1.5..3.5)) # be gentle; Scholar throttles aggressively
          doc = Nokogiri::HTML(URI.open(url, "User-Agent" => "Ruby/#{RUBY_VERSION}",
                                             :read_timeout => 15, :open_timeout => 15).read)
          meta = doc.css('meta[name="description"]').first || doc.css('meta[property="og:description"]').first
          matched = meta && meta["content"].to_s.match(/Cited by (\d+[,\d]*)/)
          raise "no citation count in the page" unless matched

          human = ActiveSupport::NumberHelper.number_to_human(
            matched[1].delete(",").to_i,
            :format => "%n%u", :precision => 2,
            :units => { :thousand => "K", :million => "M", :billion => "B" }
          )
          self.class.remember(key, human)
          human
        rescue StandardError => e
          cached = self.class.cache[key]
          if cached
            Jekyll.logger.info "Scholar citations:", "#{key} unreachable (#{e.class}), using cached #{cached}"
            cached
          else
            Jekyll.logger.warn "Scholar citations:", "#{key} unreachable (#{e.class}: #{e.message}) and not cached"
            "N/A"
          end
        end

      self.class.fetched[key] = count.to_s
    end
  end
end

Liquid::Template.register_tag("google_scholar_citations", Jekyll::GoogleScholarCitationsTag)
