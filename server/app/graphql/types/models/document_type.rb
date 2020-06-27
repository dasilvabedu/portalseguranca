class Types::Models::DocumentType < Types::Base::Object
  extend ::Modules::Graphql::ActiveRecordFieldGenerators

  fields_from_columns_of Document
end
