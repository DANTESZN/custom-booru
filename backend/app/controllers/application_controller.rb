class ApplicationController < ActionController::API
  before_action :authenticate_user!, unless: :skip_authentication?
  before_action :configure_permitted_parameters, if: :devise_controller?

  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity

  private

  def skip_authentication?
    devise_controller? || active_storage_controller?
  end

  def active_storage_controller?
    # Skip authentication for ActiveStorage controllers
    self.class.name.include?('ActiveStorage') || 
    params[:controller]&.include?('active_storage') ||
    request.path.start_with?('/rails/active_storage/')
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
  end

  def not_found(exception)
    render json: { error: exception.message }, status: :not_found
  end

  def unprocessable_entity(exception)
    render json: { error: exception.message, details: exception.record.errors }, status: :unprocessable_entity
  end

  def current_user_aliases
    current_user.aliases
  end

  def pagination_meta(collection)
    {
      current_page: collection.current_page,
      total_pages: collection.total_pages,
      total_count: collection.total_count,
      per_page: collection.limit_value
    }
  end
end
