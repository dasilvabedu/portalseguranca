class Google::Autocomplete < Google::Resource
  GCS_SEARCH_AUTOCOMPLETE_BASE_URL = 'https://maps.googleapis.com/maps/api/place/queryautocomplete/json'

  def self.params(query)
    {
      input: query[:input],
      types: 'geocode',
      language: query[:locale],
      location: query[:location],
      radius: query[:radius],
    }
  end

  def self.base_url
    GCS_SEARCH_AUTOCOMPLETE_BASE_URL
  end
end
