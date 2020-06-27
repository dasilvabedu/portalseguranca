class Types::Models::UserType < Types::Base::Object
  extend ::Modules::Graphql::ActiveRecordFieldGenerators

  fields_from_columns_of User

  def self.authorized?(user, context)
    current_user = context[:current_user]
    return false if current_user.nil?

    super && (current_user&.manager? || current_user.id == user.id)
  end

  def self.scope_items(users, ctx)
    user = ctx[:current_user]
    return users if user&.manager?

    []
  end
end
