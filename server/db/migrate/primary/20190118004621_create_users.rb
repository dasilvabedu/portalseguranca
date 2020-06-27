class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string      :name, null: false
      t.string      :password_digest, null: false
      t.integer     :status, null: false, default: 0
      t.integer     :profile, null: false, default: 0
      t.string      :phone, null: false, index: { unique: true }
    end
  end
end
