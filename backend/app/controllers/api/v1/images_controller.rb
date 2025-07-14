class Api::V1::ImagesController < Api::V1::BaseController
  before_action :set_alias, except: [:relationship_types]
  before_action :set_image, only: [:show, :update, :destroy, :add_tags, :remove_tags, :relationships, :add_relationship, :remove_relationship]

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

  # GET /api/v1/aliases/:alias_id/images/:id/relationships
  def relationships
    relationships_data = @image.all_relationships.includes(:source_image, :related_image)
    
    # Group relationships by type
    grouped_relationships = relationships_data.group_by(&:relationship_type)
    
    # Format response to match frontend expectations
    response_data = grouped_relationships.map do |type, relationships|
      {
        type: type,
        description: ImageRelationship.relationship_types[type],
        relationships: relationships.map do |rel|
          other_image = rel.source_image_id == @image.id ? rel.related_image : rel.source_image
          {
            id: rel.id,
            related_image: {
              id: other_image.id,
              attributes: {
                title: other_image.title,
                file_url: other_image.file.attached? ?
                  Rails.application.routes.url_helpers.rails_blob_url(other_image.file, host: request.host_with_port, protocol: request.protocol.chomp('://')) : nil,
                alias_id: other_image.alias_id
              }
            },
            description: rel.description,
            position: rel.position,
            direction: rel.source_image_id == @image.id ? 'outgoing' : 'incoming'
          }
        end
      }
    end
    
    Rails.logger.info "RELATIONSHIP RESPONSE: #{response_data.to_json}"
    render_success(response_data)
  end

  # POST /api/v1/aliases/:alias_id/images/:id/relationships
  def add_relationship
    related_image_id = params[:related_image_id]
    relationship_type = params[:relationship_type]
    description = params[:description]
    
    # Find the related image (must be from same alias for now, can be expanded later)
    related_image = @alias.images.find(related_image_id)
    
    relationship = @image.add_relationship(
      related_image, 
      relationship_type, 
      description: description
    )
    
    if relationship
      render_success({
        message: 'Relationship created successfully',
        relationship: {
          id: relationship.id,
          type: relationship.relationship_type,
          description: relationship.description,
          related_image: ImageSerializer.new(related_image).serializable_hash[:data]
        }
      }, status: :created)
    else
      render_error('Failed to create relationship', details: relationship.errors)
    end
  end

  # DELETE /api/v1/aliases/:alias_id/images/:id/relationships/:relationship_id
  def remove_relationship
    relationship = @image.source_relationships.find(params[:relationship_id])
    
    if relationship.destroy
      # Also remove reverse relationship if it exists
      reverse_types = {
        'sequel' => 'prequel',
        'prequel' => 'sequel',
        'inspiration' => 'reference',
        'reference' => 'inspiration'
      }
      
      if reverse_types.key?(relationship.relationship_type)
        reverse_relationship = ImageRelationship.find_by(
          source_image: relationship.related_image,
          related_image: @image,
          relationship_type: reverse_types[relationship.relationship_type]
        )
        reverse_relationship&.destroy
      end
      
      render_success({ message: 'Relationship removed successfully' })
    else
      render_error('Failed to remove relationship')
    end
  end

  # GET /api/v1/relationship_types
  def relationship_types
    render_success(ImageRelationship.relationship_types)
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