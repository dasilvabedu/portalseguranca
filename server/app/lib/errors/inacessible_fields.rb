module Errors
  class InacessibleFields < StandardError
    def initialize(msg = 'Erro de campo inacessível')
      super(msg)
    end
  end
end
