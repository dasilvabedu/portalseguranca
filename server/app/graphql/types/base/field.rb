class Types::Base::Field < GraphQL::Schema::Field
  argument_class ::Types::Base::Argument

  def initialize(authenticated: false, **kwargs, &block)
    if authenticated
      @accessible_method = method(
        :default_accessible_method_implementation
      )
    end
    super(**kwargs, &block)
  end

  def authenticated(proc_object = nil, &block)
    if proc_object.nil? && block.nil?
      @accessible_method = method(
        :default_accessible_method_implementation
      )
    else
      @accessible_method = (proc_object || block)
    end
  end

  def accessible?(context)
    if @accessible_method
      @accessible_method.call(context)
    else
      super
    end
  end

  private

  def default_accessible_method_implementation(context)
    !context[:current_user].nil?
  end
end
