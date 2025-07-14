# Force HTTP in development environment
if Rails.env.development?
  Rails.application.configure do
    # Force HTTP for all Rails URL generation
    config.force_ssl = false
    config.assume_ssl = false
    
    # Set default URL options
    config.after_initialize do
      Rails.application.routes.default_url_options = {
        host: 'localhost:3000',
        protocol: 'http'
      }
      
      # Force Active Storage to use HTTP
      ActiveStorage::Current.url_options = {
        host: 'localhost:3000',
        protocol: 'http'
      }
    end
  end
  
  # Override request detection to always return HTTP in development
  Rails.application.config.to_prepare do
    ActionDispatch::Request.class_eval do
      def scheme
        'http'
      end
      
      def ssl?
        false
      end
      
      def protocol
        'http://'
      end
    end
  end
end