# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  respond_to :json

  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    render json: {
      message: 'Successfully signed in',
      user: {
        id: resource.id,
        email: resource.email,
        aliases: resource.aliases.select(:id, :name)
      }
    }, status: :ok
  end

  def destroy
    if current_user
      sign_out(current_user)
      render json: { message: 'Successfully signed out' }, status: :ok
    else
      render json: { error: 'No active session found' }, status: :unauthorized
    end
  end

  private

  def respond_with(resource, _opts = {})
    render json: {
      message: 'Successfully signed in',
      user: {
        id: resource.id,
        email: resource.email,
        aliases: resource.aliases.select(:id, :name)
      }
    }, status: :ok
  end

  def respond_to_on_destroy
    render json: { message: 'Successfully signed out' }, status: :ok
  end
end
