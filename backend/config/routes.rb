Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  # API routes
  namespace :api do
    namespace :v1 do
      resources :aliases do
        resources :images do
          member do
            post :add_tags
            delete :remove_tags
            get :relationships
            post :add_relationship
            delete 'relationships/:relationship_id', to: 'images#remove_relationship', as: :remove_relationship
          end
        end
      end
      
      resources :tags, only: [:index, :show, :create]
      
      get 'search/images', to: 'search#images'
      get 'images/relationship_types', to: 'images#relationship_types'
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Root route for API
  root to: proc { [200, {}, ['{"message": "CustomBooru API is running"}']] }
end
