class Image < ApplicationRecord
  belongs_to :alias
  has_and_belongs_to_many :tags
  has_one_attached :file

  # Image relationships
  has_many :source_relationships, class_name: 'ImageRelationship', foreign_key: 'source_image_id', dependent: :destroy
  has_many :target_relationships, class_name: 'ImageRelationship', foreign_key: 'related_image_id', dependent: :destroy
  
  # Related images through relationships
  has_many :related_images, through: :source_relationships, source: :related_image
  has_many :referencing_images, through: :target_relationships, source: :source_image

  validates :title, presence: true
  validates :alias, presence: true
  validates :file, presence: true

  delegate :user, to: :alias

  def metadata
    @metadata ||= (super || {})
  end

  # Get all relationships for this image (both as source and target)
  def all_relationships
    ImageRelationship.where(
      "(source_image_id = ? OR related_image_id = ?)", id, id
    ).includes(:source_image, :related_image)
  end

  # Get relationships by type
  def relationships_by_type(type)
    source_relationships.by_type(type).ordered.includes(:related_image)
  end

  # Get all related images regardless of direction or type
  def all_related_images
    relationship_ids = all_relationships.pluck(:source_image_id, :related_image_id).flatten.uniq
    relationship_ids.delete(id) # Remove self
    Image.where(id: relationship_ids)
  end

  # Add a relationship to another image
  def add_relationship(other_image, relationship_type, description: nil, position: nil)
    return false if other_image == self
    
    relationship = source_relationships.build(
      related_image: other_image,
      relationship_type: relationship_type,
      description: description,
      position: position || source_relationships.by_type(relationship_type).count
    )
    
    if relationship.save
      relationship.create_reverse_relationship!
      relationship
    else
      false
    end
  end

  # Remove a relationship
  def remove_relationship(other_image, relationship_type)
    relationship = source_relationships.find_by(
      related_image: other_image,
      relationship_type: relationship_type
    )
    
    if relationship
      # Also remove reverse relationship if it exists
      reverse_types = {
        'sequel' => 'prequel',
        'prequel' => 'sequel',
        'inspiration' => 'reference',
        'reference' => 'inspiration'
      }
      
      if reverse_types.key?(relationship_type)
        reverse_relationship = ImageRelationship.find_by(
          source_image: other_image,
          related_image: self,
          relationship_type: reverse_types[relationship_type]
        )
        reverse_relationship&.destroy
      end
      
      relationship.destroy
      true
    else
      false
    end
  end

  private

  def acceptable_image
    return unless file.attached?
    
    unless file.blob.content_type.in?(['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'])
      errors.add(:file, 'must be a PNG, JPG, JPEG, GIF, or WebP image')
    end
  end
end
