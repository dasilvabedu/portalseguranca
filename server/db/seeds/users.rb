User.find_or_create_by(name: 'Administrador') do |user|
  puts 'Creating administrator with default password'
  user.phone = '11900000000'
  user.password = '1234567890'
  user.profile = 'manager'
end
