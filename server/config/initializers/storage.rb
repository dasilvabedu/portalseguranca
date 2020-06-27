if Rails.env.development?
  ActiveStorage::Current.host = 'http://localhost:3000/'
end
