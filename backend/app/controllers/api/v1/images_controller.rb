class Api::V1::ImagesController < Api::V1::BaseController
  before_action :set_alias
  before_action :set_image, only: [:show, :update, :destroy, :add_tags, :remove_tags]

  def index
    images = @alias.images.includes(:tags).order(created_at: :desc)
    render_paginated(images, ImageSerializer, include: [:tags])
  end

  def show
    render_success(ImageSerializer.new(@image, include: [:tags]).serializable_hash[:data])
  end

  def create
    @image = @alias.images.build(image_params)

    if @image.save
      # Add tags if provided
      if params[:tags].present?
        tag_names = params[:tags].is_a?(Array) ? params[:tags] : [params[:tags]]
        tags = tag_names.map do |tag_name|
          Tag.find_or_create_by(name: tag_name.strip.downcase)
        end
        @image.tags << tags
      end
      
      render_success(ImageSerializer.new(@image, include: [:tags]).serializable_hash[:data], status: :created)
    else
      render_error('Failed to create image', details: @image.errors)
    end
  end

  def update
    if @image.update(image_params_for_update)
      render_success(ImageSerializer.new(@image, include: [:tags]).serializable_hash[:data])
    else
      render_error('Failed to update image', details: @image.errors)
    end
  end

  def destroy
    if @image.destroy
      render json: { message: 'Image deleted successfully' }, status: :ok
    else
      render_error('Failed to delete image')
    end
  end

  def add_tags
    tag_names = params[:tags] || []
    tags = tag_names.map do |tag_name|
      Tag.find_or_create_by(name: tag_name.strip.downcase)
    end

    @image.tags << tags.reject { |tag| @image.tags.include?(tag) }
    
    render_success(ImageSerializer.new(@image, include: [:tags]).serializable_hash[:data])
  end

  def remove_tags
    tag_names = params[:tags] || []
    tags_to_remove = @image.tags.where(name: tag_names)
    @image.tags.delete(tags_to_remove)
    
    render_success(ImageSerializer.new(@image, include: [:tags]).serializable_hash[:data])
  end

  private

  def set_alias
    @alias = current_user_aliases.find(params[:alias_id])
  end

  def set_image
    @image = @alias.images.find(params[:id])
  end

  def image_params
    params.require(:image).permit(:title, :description, :file, metadata: {})
  end

  def image_params_for_update
    params.require(:image).permit(:title, :description, metadata: {})
  end
end