module Mutations
  class UploadFile < BaseMutation
    def resolve(file:, ignore_validation:)
      return true
    end
  end
end
