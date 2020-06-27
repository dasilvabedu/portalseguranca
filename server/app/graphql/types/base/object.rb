class Types::Base::Object < GraphQL::Schema::Object
  field_class Types::Base::Field

  def self.scope_by_user_id
    define_singleton_method(:scope_items) do |items, context|
      user = context[:current_user]
      return items if user.manager?
      items.where(user_id: user.id)
    end
  end

  def self.authorize_by_user_id
    define_singleton_method(:authorized?) do |object, context|
      user = context[:current_user]
      super(object, context) &&
        (user.manager? || user.id == object.user_id)
    end
  end
end
