module GraphQLTest
  class MutationTest
    attr_accessor :mutation

    def initialize(
      mutation_class,
      object: nil,
      context: {},
      query: OpenStruct.new
    )
      @mutation = mutation_class.new(
        object: object,
        context: GraphQL::Query::Context.new(
          query: query,
          object: object,
          values: context
        )
      )
    end
  end

  class QueryTest
    attr_accessor :Query

    def initialize(
      query_class,
      object: nil,
      context: {},
      query: OpenStruct.new
    )
      @query = query_class.new(
        object: object,
        context: GraphQL::Query::Context.new(
          query: query,
          object: object,
          values: context
        )
      )
    end
  end
end

