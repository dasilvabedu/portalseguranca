module Utils
  class Error
    def self.log_error(error)
      Rails.logger.error("#{error.class.name} (#{error.message}):")
      Rails.logger.error(error.backtrace.join("\n"))
    end

    def self.log_and_raise_as_execution_error(
      error,
      execution_error_message = error.message,
      execution_error_options = {}
    )
      log_error(error)
      raise GraphQL::ExecutionError.new(
        execution_error_message,
        **execution_error_options
      )
    end

    def self.add_active_record_errors_to_context(error, context)
      record = error.record

      if record && record.errors && record.errors.size > 0
        record.errors.keys.each do |attribute|
          record.errors.full_messages_for(attribute).each do |message|
            graphql_error = GraphQL::ExecutionError.new(message || 'Erro de validação')
            graphql_error.path = context.path + [attribute.to_s]
            context.add_error(graphql_error)
          end
        end
      else
        context.add_error(
          GraphQL::ExecutionError.new('Registro inválido')
        )
      end
    end
  end
end
