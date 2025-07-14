class Tag < ApplicationRecord
  has_and_belongs_to_many :images

  validates :name, presence: true, uniqueness: true, format: { with: /\A[a-zA-Z0-9_-]+\z/ }

  scope :popular, -> { joins(:images).group('tags.id').order('COUNT(images.id) DESC') }

  def to_param
    name
  end
end
