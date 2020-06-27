class Types::Models::ActiveStorageBlobType < Types::Base::Object
  extend ::Modules::Graphql::ActiveRecordFieldGenerators

  fields_from_columns_of ActiveStorage::Blob
end
