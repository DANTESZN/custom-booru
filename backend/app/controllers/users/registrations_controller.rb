# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def create
    build_resource(sign_up_params)

    if resource.save
      render json: {
        message: 'Successfully registered',
        user: {
          id: resource.id,
          email: resource.email
        }
      }, status: :created
    else
      render json: {
        error: 'Registration failed',
        details: resource.errors
      }, status: :unprocessable_entity
    end
  end

  def update
    if resource.update_with_password(account_update_params)
      render json: {
        message: 'Account updated successfully',
        user: {
          id: resource.id,
          email: resource.email
        }
      }, status: :ok
    else
      render json: {
        error: 'Update failed',
        details: resource.errors
      }, status: :unprocessable_entity
    end
  end

  def destroy
    if resource.destroy
      render json: { message: 'Account deleted successfully' }, status: :ok
    else
      render json: { error: 'Failed to delete account' }, status: :unprocessable_entity
    end
  end

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        message: 'Successfully registered',
        user: {
          id: resource.id,
          email: resource.email
        }
      }, status: :created
    else
      render json: {
        error: 'Registration failed',
        details: resource.errors
      }, status: :unprocessable_entity
    end
  end
end
