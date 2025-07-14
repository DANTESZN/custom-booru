# Configure Active Storage for Docker development environment
Rails.application.configure do
  # Force HTTP for all URL generation in production (Docker environment)
  if Rails.env.production?
    config.force_ssl = false
    config.assume_ssl = false
    
    # Override URL options at the application level
    Rails.application.routes.default_url_options = {
      host: 'localhost:3000',
      protocol: 'http'
    }
    
    # Force Active Storage to use HTTP
    config.after_initialize do
      ActiveStorage::Current.url_options = {
        host: 'localhost:3000',
        protocol: 'http'
      }
    end
  end
end