module Errors
  class UserNotAuthorized < StandardError
    def initialize(msg = 'Você não tem permissão para realizar esta ação')
      super(msg)
    end
  end
end
