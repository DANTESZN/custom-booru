class Image < ApplicationRecord
  belongs_to :alias
  has_and_belongs_to_many :tags
  has_one_attached :file

  validates :title, presence: true
  validates :alias, presence: true
  validates :file, presence: true

  delegate :user, to: :alias

  def metadata
    @metadata ||= (super || {})
  end

  private

  def acceptable_image
    return unless file.attached?
    
    unless file.blob.content_type.in?(['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'])
      errors.add(:file, 'must be a PNG, JPG, JPEG, GIF, or WebP image')
    end
  end
end
