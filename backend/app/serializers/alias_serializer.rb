class AliasSerializer
  include JSONAPI::Serializer
  
  attributes :id, :name, :bio, :social_links, :created_at, :updated_at
  
  belongs_to :user
  has_many :images
  
  attribute :avatar_url do |alias_record|
    if alias_record.avatar.attached?
      Rails.application.routes.url_helpers.rails_blob_url(alias_record.avatar, only_path: true)
    end
  end
  
  attribute :images_count do |alias_record|
    alias_record.images.count
  end
end