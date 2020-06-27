class User < ApplicationRecord
  has_secure_password

  before_destroy :at_least_one_manager_should_remains

  validates :name,
    presence: true

  validates :phone,
    presence: true,
    uniqueness: true,
    format: {
      with: /\d{10,11}/
    }

  enum profile: {
    normal: 0,
    manager: 1
  }

  def jwt
    Authorization::JwtEncoder.encode({
      sub: id,
      exp: 1.day.from_now.to_i,
      name: name,
      phone: phone,
      profile: profile,
    })
  end

  private

  def at_least_one_manager_should_remains
    if self.in?(User.managers) && User.managers.one?
      raise ActiveRecord::RecordNotDestroyed, 'Impossível excluir último administrador.'
    end
  end
end
