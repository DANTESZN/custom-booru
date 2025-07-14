class Api::V1::BaseController < ApplicationController
  private

  def render_success(data, status: :ok, meta: nil)
    response = { data: data }
    response[:meta] = meta if meta
    render json: response, status: status
  end

  def render_error(message, status: :unprocessable_entity, details: nil)
    response = { error: message }
    response[:details] = details if details
    render json: response, status: status
  end

  def render_paginated(collection, serializer_class, options = {})
    paginated_collection = collection.page(params[:page]).per(params[:per_page] || 20)
    
    render_success(
      serializer_class.new(paginated_collection, options).serializable_hash[:data],
      meta: pagination_meta(paginated_collection)
    )
  end
end