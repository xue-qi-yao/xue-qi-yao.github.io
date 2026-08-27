# Adds --sort_by and --order to the {% bibliography %} tag.
#
# jekyll-scholar reads both from the global `scholar:` config only; there is no
# per-tag option for them. This site needs two different orders: /publications
# stays in publication-date order, while the "selected publications" list on the
# home page is ranked by citation count. Consuming the flags here and writing
# them into the tag's own config gives each tag its own ordering.
module JekyllScholarSortOptions
  PATTERN = /--(sort_by|order)\s+(\S+)/.freeze

  def optparse(arguments)
    return super if arguments.nil? || arguments.empty?

    remaining = arguments.gsub(PATTERN) do
      config[Regexp.last_match(1)] = Regexp.last_match(2)
      " "
    end

    super(remaining.strip)
  end
end

Jekyll::Scholar::Utilities.prepend(JekyllScholarSortOptions)
