class CreateImageRelationships < ActiveRecord::Migration[8.0]
  def change
    create_table :image_relationships do |t|
      t.references :source_image, null: false, foreign_key: { to_table: :images }
      t.references :related_image, null: false, foreign_key: { to_table: :images }
      t.string :relationship_type, null: false
      t.text :description
      t.integer :position, default: 0

      t.timestamps
    end

    # Add indexes for better query performance
    add_index :image_relationships, [:source_image_id, :relationship_type]
    add_index :image_relationships, [:related_image_id, :relationship_type]
    add_index :image_relationships, [:source_image_id, :position]
    
    # Prevent duplicate relationships
    add_index :image_relationships, [:source_image_id, :related_image_id, :relationship_type], 
              unique: true, name: 'unique_image_relationship'
    
    # Add check constraint to prevent self-referencing relationships
    add_check_constraint :image_relationships, 'source_image_id != related_image_id', 
                        name: 'prevent_self_reference'
  end
end
