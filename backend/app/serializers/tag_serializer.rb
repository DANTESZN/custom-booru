class TagSerializer
  include JSONAPI::Serializer
  
  attributes :id, :name, :created_at, :updated_at
  
  has_many :images
  
  attribute :usage_count do |tag|
    tag.images.count
  end
end