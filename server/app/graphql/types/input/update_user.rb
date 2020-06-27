class Types::Input::UpdateUser < Types::Base::InputObject
  argument :name, String, required: false
  argument :email, String, required: false
  argument :password, String, required: false
end
