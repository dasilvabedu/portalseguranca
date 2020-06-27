class Mutations::BaseMutation < GraphQL::Schema::Mutation
  def ready?(**args)
    return true if logged?

    raise Errors::UserNotAuthorized
  end

  protected

  def current_user
    context[:current_user]
  end

  def logged?
    !current_user.nil?
  end

  def manager?
    current_user && current_user.manager?
  end
end
