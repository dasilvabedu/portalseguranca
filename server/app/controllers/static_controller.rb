require 'rails/application_controller'

class StaticController < Rails::ApplicationController
  def index
    render file: Rails.root.join('public', 'index.html'), layout: false
  end
end
