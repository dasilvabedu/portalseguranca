module Errors
  class UnauthorizedObject < StandardError
    def initialize(msg = 'Erro de objeto não autorizado')
      super(msg)
    end
  end
end
