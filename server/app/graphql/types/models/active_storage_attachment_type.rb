class Types::Models::ActiveStorageAttachmentType < Types::Base::Object
  extend ::Modules::Graphql::ActiveRecordFieldGenerators
  include Rails.application.routes.url_helpers

  fields_from_columns_of ActiveStorage::Attachment

  field :blob, ::Types::Models::ActiveStorageBlobType, null: false

  field :download_link, String, null: false
  def download_link
    rails_blob_path(object, disposition: 'attachment', only_path: true)
  end
end
