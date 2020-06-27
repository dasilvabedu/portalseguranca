class Types::QueryType < Types::Base::Object
  extend ::Modules::Graphql::ActiveRecordFieldGenerators

  default_finders_for User, ::Types::Models::UserType,
    restrict: true, scope: true

  default_finders_for Document, ::Types::Models::DocumentType,
    restrict: false

  # ----------------------------------------------------------------------------

  field :autocomplete, Types::Base::JSON, null: false do
    argument :query, String, required: true
    argument :locale, String, required: false
    argument :location, String, required: false
  end
  def autocomplete(query:, location: nil, locale: 'pt-BR')
    ::Google::Autocomplete
      .search(
        input: query,
        locale: locale,
        location: location,
        radius: 100_000 || ENV['RADIUS']&.to_i
      )
  end

  field :geocode, Types::Base::JSON, null: false do
    argument :address, String, required: true
  end
  def geocode(address:)
    ::Google::Geocode.search(address: address)
  end
end
