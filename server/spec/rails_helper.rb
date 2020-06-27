require 'simplecov'
require 'spec_helper'

SimpleCov.start do
  add_group 'Models', 'app/models/'
end

ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'rspec/rails'

Dir[Rails.root.join('spec/config/**/*.rb')].each { |f| require f }
require_relative 'support/graphql_test'

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  puts e.to_s.strip
  exit 1
end

RSpec.configure do |config|
  config.include GraphQLTest
  config.extend GraphQLTest

  config.use_transactional_fixtures = true
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!
  # config.filter_gems_from_backtrace("gem name")
end

RSpec::Expectations.configuration.on_potential_false_positives = :nothing
