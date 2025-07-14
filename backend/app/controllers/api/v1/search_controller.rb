class Api::V1::SearchController < Api::V1::BaseController
  def images
    images = Image.joins(:alias).where(aliases: { user: current_user })
                  .includes(:tags, :alias)
                  .order(created_at: :desc)

    # Filter by tags
    if params[:tags].present?
      tag_names = params[:tags].split(',').map(&:strip)
      
      if tag_names.length == 1
        # Single tag search
        images = images.joins(:tags).where(tags: { name: tag_names.first })
      else
        # Multiple tags - find images that have ALL specified tags using subquery
        tag_ids = Tag.where(name: tag_names).pluck(:id)
        if tag_ids.length == tag_names.length
          image_ids = ActiveRecord::Base.connection.execute(
            "SELECT image_id FROM images_tags WHERE tag_id IN (#{tag_ids.join(',')}) 
             GROUP BY image_id HAVING COUNT(DISTINCT tag_id) = #{tag_ids.length}"
          ).map { |row| row['image_id'] }
          images = images.where(id: image_ids)
        else
          # Some tags don't exist, return empty result
          images = images.none
        end
      end
    end

    # Search in title and description
    if params[:query].present?
      search_term = "%#{params[:query]}%"
      images = images.where(
        'images.title ILIKE ? OR images.description ILIKE ?',
        search_term, search_term
      )
    end

    # Filter by alias
    if params[:alias_name].present?
      images = images.where(aliases: { name: params[:alias_name] })
    elsif params[:alias_id].present?
      images = images.where(alias_id: params[:alias_id])
    end

    # Sort options
    case params[:sort]
    when 'title'
      images = images.order(:title)
    when 'oldest'
      images = images.order(:created_at)
    else
      images = images.order(created_at: :desc)
    end

    render_paginated(images, ImageSerializer, include: [:tags, :alias])
  end
end