class Types::Base::Argument < GraphQL::Schema::Argument
  # TODO extract this into an unopionionated lib
  attr_reader :profiles

  def initialize(*args, profiles: nil, **kwargs, &block)
    super(*args, **kwargs, &block)
    if profiles.present?
      profiles = [profiles] unless profiles.respond_to?(:map)
      profiles = profiles.map(&:to_s)
      profiles = User.profiles.keys if profiles[0] == 'all'
    end

    @profiles = profiles
  end

  def authorized?(_, context)
    return true unless profiles
    profiles.include? context[:current_user]&.profile
  end

  def visible?(context)
    return true unless profiles
    profiles.include? context[:current_user]&.profile
  end
end
