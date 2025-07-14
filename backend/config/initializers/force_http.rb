# Force HTTP protocol for Docker development
if Rails.env.production? && ENV['RAILS_FORCE_SSL'] == 'false'
  Rails.application.configure do
    config.force_ssl = false
    config.assume_ssl = false
  end
  
  # Override protocol detection to always return HTTP
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
    
    # Force all URL helpers to use HTTP
    ActionController::Base.class_eval do
      def self.default_url_options
        { protocol: 'http', host: 'localhost:3000' }
      end
    end
  end
end