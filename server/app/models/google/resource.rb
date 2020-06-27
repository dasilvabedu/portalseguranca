require 'open-uri'

class Google::Resource
  def self.search(query, sessiontoken: :samesession)
    get(uri(build_params(query, sessiontoken)))
  rescue => e
    raise "Google Cloud Services connection error: #{e.class} '#{e.message}'"
  end

  protected

  def self.params(query)
    raise 'Not implemented yet'
  end

  def self.base_url
    raise 'Not implemented yet'
  end

  private

  def self.build_params(query, sessiontoken)
    common_params(sessiontoken).merge! params(query)
  end

  def self.common_params(sessiontoken)
    {
      sessiontoken: sessiontoken,
      key: Rails.application.credentials.dig(:gcp, :api_key),
    }
  end

  def self.uri(hash_params)
    URI::encode [base_url, query_string_from_hash(hash_params)].join('?')
  end

  def self.query_string_from_hash(hash_params)
    hash_params.keys.map! { |key| "#{key}=#{hash_params[key]}" }.join('&')
  end

  def self.get(uri, type: :json)
    Rails.cache.fetch(uri) do
      response = open(uri).read
      return JSON.parse(response) if type == :json

      response
    end
  end
end
