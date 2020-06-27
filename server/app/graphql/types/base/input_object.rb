class Types::Base::InputObject < GraphQL::Schema::InputObject
  argument_class ::Types::Base::Argument

  def self.default_graphql_name
    "#{super}Input"
  end
end
