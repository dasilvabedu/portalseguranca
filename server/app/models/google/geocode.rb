class Google::Geocode < Google::Resource
  GCS_SEARCH_GEOCODE_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'

  def self.params(query)
    {
      address: query[:address]
    }
  end

  def self.base_url
    GCS_SEARCH_GEOCODE_BASE_URL
  end
end
