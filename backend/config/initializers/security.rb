# Security configurations for the CustomBooru API

# Set security headers
Rails.application.config.force_ssl = true if Rails.env.production?

# Rate limiting would typically be handled by a reverse proxy like nginx
# or by a service like Cloudflare, but you can also add gems like rack-attack

# Content Security Policy (though not as relevant for API-only apps)
Rails.application.configure do
  config.content_security_policy do |policy|
    policy.default_src :none
    policy.connect_src :self
  end if Rails.env.production?
end

# Cookie security (relevant for session-based auth, less for JWT)
Rails.application.config.session_store :disabled

# Prevent parameter pollution
Rails.application.config.action_controller.action_on_unpermitted_parameters = :raise if Rails.env.development?