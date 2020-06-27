class Authorization::JwtEncoder
  def self.encode(payload)
    JWT.encode(
      payload,
      Rails.application.credentials.secret_key_base.to_s,
      'HS256'
    )
  end

  def self.decode(token)
    body, = JWT.decode(
      token,
      Rails.application.credentials.secret_key_base.to_s,
      true,
      algorithm: 'HS256'
    )

    HashWithIndifferentAccess.new(body)
  rescue JWT::ExpiredSignature, JWT::VerificationError, JWT::DecodeError
    nil
  end
end
