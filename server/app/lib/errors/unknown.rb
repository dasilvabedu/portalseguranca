module Errors
  class Unknown < StandardError
    def initialize(msg = 'Ocorreu um erro desconhecido')
      super(msg)
    end
  end
end
