class CreateAliases < ActiveRecord::Migration[8.0]
  def change
    create_table :aliases do |t|
      t.string :name, null: false
      t.text :bio
      t.json :social_links, default: {}
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
    
    add_index :aliases, [:user_id, :name], unique: true
  end
end
