class ImageSerializer
  include JSONAPI::Serializer
  
  attributes :id, :title, :description, :metadata, :created_at, :updated_at
  
  belongs_to :alias
  has_many :tags
  
  attribute :file_url do |image|
    if image.file.attached?
      Rails.application.routes.url_helpers.rails_blob_url(image.file, host: 'localhost:3000', protocol: 'http')
    end
  end
  
  attribute :file_filename do |image|
    image.file.filename.to_s if image.file.attached?
  end
  
  attribute :file_size do |image|
    image.file.byte_size if image.file.attached?
  end
  
  attribute :file_content_type do |image|
    image.file.content_type if image.file.attached?
  end
  
  attribute :tags_list do |image|
    image.tags.pluck(:name)
  end
end