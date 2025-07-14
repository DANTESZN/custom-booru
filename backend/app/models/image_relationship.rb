class ImageRelationship < ApplicationRecord
  belongs_to :source_image, class_name: 'Image'
  belongs_to :related_image, class_name: 'Image'

  validates :relationship_type, presence: true, inclusion: { 
    in: %w[version variant series theme sequel prequel alternate inspiration reference],
    message: "%{value} is not a valid relationship type" 
  }
  validates :source_image_id, presence: true
  validates :related_image_id, presence: true
  validates :position, presence: true, numericality: { greater_than_or_equal_to: 0 }
  
  # Prevent self-referencing relationships
  validate :cannot_relate_to_self
  
  # Prevent duplicate relationships
  validates :related_image_id, uniqueness: { 
    scope: [:source_image_id, :relationship_type],
    message: "Relationship already exists"
  }

  scope :by_type, ->(type) { where(relationship_type: type) }
  scope :ordered, -> { order(:position, :created_at) }

  # Class method to get available relationship types with descriptions
  def self.relationship_types
    {
      'version' => 'Different versions of the same artwork (v1, v2, etc.)',
      'variant' => 'Variants with minor differences (color, crop, etc.)',
      'series' => 'Part of the same series or collection',
      'theme' => 'Related by theme or concept',
      'sequel' => 'Chronological follow-up to this image',
      'prequel' => 'Chronological predecessor to this image',
      'alternate' => 'Alternative take on the same concept',
      'inspiration' => 'Inspired by or inspiring this image',
      'reference' => 'Reference material or referenced by this image'
    }
  end

  def relationship_description
    self.class.relationship_types[relationship_type]
  end

  # Create bidirectional relationship if needed
  def create_reverse_relationship!
    reverse_types = {
      'sequel' => 'prequel',
      'prequel' => 'sequel',
      'inspiration' => 'reference',
      'reference' => 'inspiration'
    }

    if reverse_types.key?(relationship_type)
      reverse_type = reverse_types[relationship_type]
      
      # Check if reverse relationship already exists
      existing = ImageRelationship.find_by(
        source_image: related_image,
        related_image: source_image,
        relationship_type: reverse_type
      )

      unless existing
        ImageRelationship.create!(
          source_image: related_image,
          related_image: source_image,
          relationship_type: reverse_type,
          description: "Auto-generated reverse of: #{description}",
          position: 0
        )
      end
    end
  end

  private

  def cannot_relate_to_self
    if source_image_id == related_image_id
      errors.add(:related_image_id, "cannot be the same as source image")
    end
  end
end