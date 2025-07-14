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
  
  attribute :relationships_count do |image|
    image.all_relationships.count
  end
  
  attribute :related_images_by_type do |image|
    relationships = image.all_relationships.includes(:source_image, :related_image)
    grouped = relationships.group_by(&:relationship_type)
    
    grouped.transform_values do |rels|
      rels.map do |rel|
        other_image = rel.source_image_id == image.id ? rel.related_image : rel.source_image
        {
          id: other_image.id,
          title: other_image.title,
          file_url: other_image.file.attached? ? 
            Rails.application.routes.url_helpers.rails_blob_url(other_image.file, host: 'localhost:3000', protocol: 'http') : nil,
          relationship_id: rel.id,
          direction: rel.source_image_id == image.id ? 'outgoing' : 'incoming',
          description: rel.description,
          position: rel.position
        }
      end
    end
  end
end