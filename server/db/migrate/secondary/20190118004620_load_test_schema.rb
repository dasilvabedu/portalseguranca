class LoadTestSchema < ActiveRecord::Migration[5.2]
  def change
    enable_extension 'uuid-ossp'

    create_table 'lib_modules_graphql_active_record_field_generators_spec_fake_models' do |t|
      t.uuid 'uuid_field', default: 'uuid_generate_v4()'
      t.string 'string_field', limit: 20
      t.integer 'integer_field'
      t.decimal 'decimal_field'
      t.date 'date_field'
      t.datetime 'datetime_field'
      t.boolean 'boolean_field'
      t.string 'password_before'
      t.string 'after_password'
      t.string 'middle_password_in_the_middle'
      t.integer 'enum_field', default: 0
      t.string 'not_null_field', null: false
      t.string 'null_field', null: true
    end
  end
end
