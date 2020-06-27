class UserMailer < ApplicationMailer
  def confirm_user(user)
    @user = user

    mail to: user.email, subject: "Bem-vindo"
  end
end
