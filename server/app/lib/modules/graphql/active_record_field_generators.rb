module Modules
  module Graphql
    module ActiveRecordFieldGenerators
      TYPES = {
        uuid: GraphQL::Types::ID,
        integer: GraphQL::Types::Int,
        string: GraphQL::Types::String,
        text: GraphQL::Types::String,
        decimal: GraphQL::Types::Float,
        date: GraphQL::Types::String,
        datetime: GraphQL::Types::String,
        boolean: GraphQL::Types::Boolean,
        # jsonb: ::Types::Base::JSON,
        # json: ::Types::Base::JSON
      }

      def default_finders_for(
        model_class,
        return_type,
        restrict: false,
        scope: false,
        field_name: nil
      )
        field model_class.model_name.singular, return_type, null: true do
          authenticated if restrict
          argument :id, GraphQL::Types::Int, required: true
        end
        define_method(model_class.model_name.singular.to_sym) do |args|
          model_class.find_by(id: args[:id])
        end

        field_name = field_name || "all_#{model_class.model_name.plural}"
        field field_name, [return_type], null: false, scope: scope do
          authenticated if restrict
          argument :limit, Integer, required: false
          argument :offset, Integer, required: false
          # argument :order, ::Types::Base::JSON, required: false
          # argument :where, ::Types::Base::JSON, required: false
        end
        define_method(
          field_name.to_sym
        ) do |order: 'id', limit: nil, offset: nil, where: {}|
          model_class
            .all
            .order(order)
            .limit(limit)
            .offset(offset)
            .where(where)
        end
      end

      def fields_from_columns_of(model_class)
        enums = model_class.defined_enums.keys
        model_class.columns.each do |column|
          next if column.name =~ /password/

          type =  if enums.include?(column.name)
                    GraphQL::Types::String
                  else
                    TYPES[column.type]
                  end

          field column.name, type, null: column.null
        end
      end
    end
  end
end
