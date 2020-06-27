class Types::MutationType < Types::Base::Object
  field :create_token,
    mutation: Mutations::CreateToken
end
