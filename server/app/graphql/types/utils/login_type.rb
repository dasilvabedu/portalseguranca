class Types::Utils::LoginType < Types::Base::Object
  extend ::Modules::Graphql::ActiveRecordFieldGenerators

  field :token, String, null: false
end
