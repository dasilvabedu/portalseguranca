class GeocartSchema < GraphQL::Schema
  use GraphQL::Batch

  mutation(Types::MutationType)
  query(Types::QueryType)

  def self.inaccessible_fields(_error = nil)
    # Hack to not generate duplicated code
    # because you have to return a new instance of GraphQL::AnalysisError
    # and you can't raise it either, even with graphql-errors
    GraphQL::AnalysisError.new(
      Errors::InacessibleFields.new.message,
      extensions: { forbidden: true }
    )
  end

  def self.unauthorized_object(_error = nil)
    # Same hack as above
    raise GraphQL::ExecutionError.new(
      Errors::UnauthorizedObject.new.message,
      extensions: { forbidden: true }
    )
  end

  GraphQL::Errors.configure(self) do
    rescue_from ActiveRecord::RecordInvalid do |e, _, _, context|
      Utils::Error.log_error(e)
      Utils::Error.add_active_record_errors_to_context(e, context)

      # This is necessary
      nil
    end

    rescue_from(GraphQL::ExecutionError) { raise }

    rescue_from(Errors::UserNotAuthorized) do |error|
      Utils::Error.log_and_raise_as_execution_error(
        error,
        error.message,
        extensions: { forbidden: true }
      )
    end

    rescue_from ActiveRecord::RecordNotFound do |error|
      Utils::Error.log_and_raise_as_execution_error(error,
        'Registro não encontrado'
      )
    end

    rescue_from ActiveRecord::RecordNotDestroyed do |e, _, _, context|
      Utils::Error.log_error(e)
      Utils::Error.add_active_record_errors_to_context(e, context)

      # This is necessary
      nil
    end

    rescue_from ActiveRecord::RecordNotUnique do |error|
      Utils::Error.log_and_raise_as_execution_error(error,
        'Registro duplicado'
      )
    end

    rescue_from ActiveRecord::ActiveRecordError do |error|
      Utils::Error.log_and_raise_as_execution_error(error,
        'Erro na persistência dos dados'
      )
    end

    rescue_from StandardError do |error|
      Utils::Error.log_and_raise_as_execution_error(error,
        'Ocorreu um erro desconhecido'
      )
    end
  end
end

GeocartSchema.graphql_definition
