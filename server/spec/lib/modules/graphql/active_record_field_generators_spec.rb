require 'rails_helper'

class FakeType
  extend Modules::Graphql::ActiveRecordFieldGenerators
  def self.field(_, _, _ = nil, _ = nil); end
end

class FakeModel < ApplicationRecord
  connects_to database: { writing: :secondary, reading: :secondary }
  self.table_name = "lib_modules_graphql_active_record_field_generators_spec_fake_models"
  enum enum_field: { zero: 0, one: 1 }
end

class FakeModelType < Types::Base::Object; end

RSpec.describe Modules::Graphql::ActiveRecordFieldGenerators do
  context 'when extended' do
    before :each do
      allow( FakeType ).to receive( :field ).with( anything, anything, anything )
    end

    describe '::default_finders_for' do
      before :each do
        FakeType.default_finders_for FakeModel, FakeModelType
      end

      let (:field_context_spy) { spy('field_context_spy') }

      context 'when called with default options' do
        it 'defines a field called {model_name} whose type is the specified type' do
          expect( FakeType )
            .to have_received( :field )
            .with( 'fake_model', FakeModelType, anything )

          expect( FakeType.method_defined?(:fake_model) ).to eq( true )
        end

        it 'has a required argument id of type Int on the defined {model_name} field' do
          allow( FakeType ).to receive( :field ) {|_, _, **_, &block|
            field_context_spy.instance_eval(&block)
          }

          FakeType.default_finders_for FakeModel, FakeModelType
          expect( field_context_spy ).to have_received( :argument ).exactly(5).times
          expect( field_context_spy )
            .to have_received( :argument )
            .with( :id, GraphQL::Types::Int, hash_including(required: true) )
        end

        # TODO: decouple these from the User model (extract to lib?)

        # it 'defines a resolver for the {model_name} field that finds the model by id' do
        #   FakeType.default_finders_for User, FakeModelType
        #   user = create(:user)

        #   expect( FakeType.new.user(id: user.id) ).to be_an_instance_of( User )
        #   expect( FakeType.new.user(id: user.id).id ).to eq( user.id )
        # end

        # it 'defines a resolver for the all_{model_name}s field that returns all models' do
        #   FakeType.default_finders_for User, FakeModelType
        #   user1 = create(:user, name: 'b')
        #   user2 = create(:user, name: 'a')
        #   user3 = create(:user, name: 'c')

        #   expect( FakeType.new.all_users.pluck(:id) )
        #     .to match_array([ user1.id, user2.id, user3.id ])
        #   expect( FakeType.new.all_users(order: :name).pluck(:id) )
        #     .to match_array([ user2.id, user1.id, user3.id ])
        #   expect( FakeType.new.all_users.map(&:class) )
        #     .to match_array([ User, User, User ])
        # end

        it 'defines a field called all_{model_name}s whose type is an array of the specified type' do
          expect( FakeType )
            .to have_received( :field )
            .with( 'all_fake_models', [FakeModelType], anything )

          expect( FakeType.method_defined?(:all_fake_models) ).to eq( true )
        end

        it 'has a non-required argument order of type ::Types::Base::JSON on the defined all_{model_name}s field' do
          allow( FakeType ).to receive( :field ) {|_, _, **_, &block|
            field_context_spy.instance_eval(&block)
          }

          FakeType.default_finders_for FakeModel, FakeModelType
          expect( field_context_spy ).to have_received( :argument ).exactly(5).times
          expect( field_context_spy )
            .to have_received( :argument )
            .with( :order, ::Types::Base::JSON, hash_including(required: false) )
        end

        it 'has a non-required argument where of type ::Types::Base::JSON on the defined all_{model_name}s field' do
          allow( FakeType ).to receive( :field ) {|_, _, **_, &block|
            field_context_spy.instance_eval(&block)
          }

          FakeType.default_finders_for FakeModel, FakeModelType
          expect( field_context_spy ).to have_received( :argument ).exactly(5).times
          expect( field_context_spy )
            .to have_received( :argument )
            .with( :where, ::Types::Base::JSON, hash_including(required: false) )
        end

        it 'has a non-required argument limit of type Integer on the defined all_{model_name}s field' do
          allow( FakeType ).to receive( :field ) {|_, _, **_, &block|
            field_context_spy.instance_eval(&block)
          }

          FakeType.default_finders_for FakeModel, FakeModelType
          expect( field_context_spy ).to have_received( :argument ).exactly(5).times
          expect( field_context_spy )
            .to have_received( :argument )
            .with( :limit, Integer, hash_including(required: false) )
        end

        it 'has a non-required argument offset of type Integer on the defined all_{model_name}s field' do
          allow( FakeType ).to receive( :field ) {|_, _, **_, &block|
            field_context_spy.instance_eval(&block)
          }

          FakeType.default_finders_for FakeModel, FakeModelType
          expect( field_context_spy ).to have_received( :argument ).exactly(5).times
          expect( field_context_spy )
            .to have_received( :argument )
            .with( :offset, Integer, hash_including(required: false) )
        end

        it 'will not call authenticated on the defined fields' do
          allow( FakeType ).to receive( :field ) {|_, _, **_, &block|
            field_context_spy.instance_eval(&block)
          }

          FakeType.default_finders_for FakeModel, FakeModelType
          expect( field_context_spy ).to_not have_received( :authenticated )
        end

        it 'will pass scope: false as option to the all_{model_name}s field' do
          expect( FakeType )
            .to have_received( :field )
            .with( 'all_fake_models', [FakeModelType], hash_including( scope: false ))
        end
      end

      context 'when called with the restrict: true option' do
        it 'will call authenticated on the defined fields' do
          allow( FakeType ).to receive( :field ) {|_, _, **_, &block|
            field_context_spy.instance_eval(&block)
          }

          FakeType.default_finders_for FakeModel, FakeModelType, restrict: true
          expect( field_context_spy ).to have_received( :authenticated ).twice
        end
      end

      context 'when called with the scope: true option' do
        it 'will pass scope: true as option to the all_{model_name}s field' do
          FakeType.default_finders_for FakeModel, FakeModelType, scope: true
          expect( FakeType )
            .to have_received( :field )
            .with( 'all_fake_models', [FakeModelType], hash_including( scope: true ))
        end
      end
    end

    describe '::fields_from_columns_of' do
      before :each do
        FakeType.fields_from_columns_of FakeModel
      end

      context 'when passed a model class' do
        it 'generates a field for each column not containing password' do
          [
            'uuid_field',
            'string_field',
            'integer_field',
            'decimal_field',
            'date_field',
            'datetime_field',
            'boolean_field',
            'enum_field',
            'not_null_field',
            'null_field'
          ].each do |field_name|
            expect( FakeType )
              .to have_received( :field )
              .with( field_name, anything, anything )
          end
        end

        it 'skips columns with password in their names' do
          expect( FakeType )
            .to_not have_received( :field )
            .with( 'password_before', anything, anything )

          expect( FakeType )
            .to_not have_received( :field )
            .with( 'after_password', anything, anything )

          expect( FakeType )
            .to_not have_received( :field )
            .with( 'middle_password_in_the_middle', anything, anything )
        end

        it 'generates an ID type field for an uuid column' do
          expect( FakeType )
            .to have_received( :field )
            .with( 'uuid_field', GraphQL::Types::ID, anything )
        end

        it 'generates an Int type field for an integer column' do
          expect( FakeType )
            .to have_received( :field )
            .with( 'integer_field', GraphQL::Types::Int, anything )
        end

        it 'generates a String type field for a string column' do
          expect( FakeType )
            .to have_received( :field )
            .with( 'string_field', GraphQL::Types::String, anything )
        end

        it 'generates a Float type field for a decimal column' do
          expect( FakeType )
            .to have_received( :field )
            .with( 'decimal_field', GraphQL::Types::Float, anything )
        end

        it 'generates an String type field for a date column' do
          expect( FakeType )
            .to have_received( :field )
            .with( 'date_field', GraphQL::Types::String, anything )
        end

        it 'generates an String type field for a datetime column' do
          expect( FakeType )
            .to have_received( :field )
            .with( 'datetime_field', GraphQL::Types::String, anything )
        end

        it 'generates a Boolean type field for a boolean column' do
          expect( FakeType )
            .to have_received( :field )
            .with( 'boolean_field', GraphQL::Types::Boolean, anything )
        end

        it 'generates a String type field when the column has an enum defined in the model' do
          expect( FakeType )
            .to have_received( :field )
            .with( 'enum_field', GraphQL::Types::String, anything )
        end

        it 'generates a required type field when the column is NOT NULL' do
          expect( FakeType )
            .to have_received( :field )
            .with( 'not_null_field', anything, null: false )
        end

        it 'generates a non-required type field when the column can be NULL' do
          expect( FakeType )
            .to have_received( :field )
            .with( 'null_field', anything, null: true )
        end
      end
    end
  end
end
