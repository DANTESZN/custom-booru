class Api::V1::TagsController < Api::V1::BaseController
  skip_before_action :authenticate_user!, only: [:index, :show]
  before_action :set_tag, only: [:show, :destroy]

  def index
    tags = Tag.all.order(:name)
    
    if params[:popular]
      tags = Tag.popular
    end

    if params[:search]
      tags = tags.where('name ILIKE ?', "%#{params[:search]}%")
    end

    render_paginated(tags, TagSerializer)
  end

  def show
    render_success(TagSerializer.new(@tag, include: [:images]).serializable_hash[:data])
  end

  def create
    @tag = Tag.new(tag_params)

    if @tag.save
      render_success(TagSerializer.new(@tag).serializable_hash[:data], status: :created)
    else
      render_error('Failed to create tag', details: @tag.errors)
    end
  end

  def destroy
    if @tag.images.any?
      render_error('Cannot delete tag that is still used by images')
    else
      @tag.destroy
      render_success(message: 'Tag deleted successfully')
    end
  end

  private

  def set_tag
    @tag = Tag.find_by!(name: params[:id])
  end

  def tag_params
    params.require(:tag).permit(:name)
  end
end