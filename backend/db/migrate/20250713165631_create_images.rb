class CreateImages < ActiveRecord::Migration[8.0]
  def change
    create_table :images do |t|
      t.string :title, null: false
      t.text :description
      t.json :metadata, default: {}
      t.references :alias, null: false, foreign_key: true

      t.timestamps
    end
    
    add_index :images, :created_at
    add_index :images, :title
  end
end
