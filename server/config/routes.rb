Rails.application.routes.draw do
  scope '/api' do
    post '/graphql', to: 'graphql#execute'
  end

  get '*path', to: 'static#index', constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
end
