class Api::V1::AliasesController < Api::V1::BaseController
  before_action :set_alias, only: [:show, :update, :destroy]

  def index
    aliases = current_user_aliases.includes(:images)
    render_success(AliasSerializer.new(aliases, include: [:images]).serializable_hash[:data])
  end

  def show
    render_success(AliasSerializer.new(@alias, include: [:images]).serializable_hash[:data])
  end

  def create
    @alias = current_user.aliases.build(alias_params)

    if @alias.save
      render_success(AliasSerializer.new(@alias).serializable_hash[:data], status: :created)
    else
      render_error('Failed to create alias', details: @alias.errors)
    end
  end

  def update
    if @alias.update(alias_params)
      render_success(AliasSerializer.new(@alias).serializable_hash[:data])
    else
      render_error('Failed to update alias', details: @alias.errors)
    end
  end

  def destroy
    if @alias.destroy
      render json: { message: 'Alias deleted successfully' }, status: :ok
    else
      render_error('Failed to delete alias')
    end
  end

  private

  def set_alias
    @alias = current_user_aliases.find(params[:id])
  end

  def alias_params
    params.require(:alias).permit(:name, :bio, :avatar, social_links: {})
  end
end