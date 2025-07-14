class UserSerializer
  include JSONAPI::Serializer
  
  attributes :id, :email, :created_at
  
  has_many :aliases
end