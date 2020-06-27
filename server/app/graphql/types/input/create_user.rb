class Types::Input::CreateUser < Types::Base::InputObject
  argument :name, String, required: true
  argument :email, String, required: true
  argument :password, String, required: true
end
