class Alias < ApplicationRecord
  belongs_to :user
  has_many :images, dependent: :destroy
  has_one_attached :avatar

  validates :name, presence: true, uniqueness: { scope: :user_id }
  validates :user, presence: true

  def social_links
    @social_links ||= (super || {})
  end
end
