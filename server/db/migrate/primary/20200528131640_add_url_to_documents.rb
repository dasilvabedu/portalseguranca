class AddUrlToDocuments < ActiveRecord::Migration[6.0]
  def change
    add_column :documents, :url, :string
    add_column :documents, :type, :string
  end
end
