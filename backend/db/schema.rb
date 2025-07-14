# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_07_14_191735) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "aliases", force: :cascade do |t|
    t.string "name", null: false
    t.text "bio"
    t.json "social_links", default: {}
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "name"], name: "index_aliases_on_user_id_and_name", unique: true
    t.index ["user_id"], name: "index_aliases_on_user_id"
  end

  create_table "image_relationships", force: :cascade do |t|
    t.bigint "source_image_id", null: false
    t.bigint "related_image_id", null: false
    t.string "relationship_type", null: false
    t.text "description"
    t.integer "position", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["related_image_id", "relationship_type"], name: "idx_on_related_image_id_relationship_type_e5e92fcb6a"
    t.index ["related_image_id"], name: "index_image_relationships_on_related_image_id"
    t.index ["source_image_id", "position"], name: "index_image_relationships_on_source_image_id_and_position"
    t.index ["source_image_id", "related_image_id", "relationship_type"], name: "unique_image_relationship", unique: true
    t.index ["source_image_id", "relationship_type"], name: "idx_on_source_image_id_relationship_type_0d76b627c8"
    t.index ["source_image_id"], name: "index_image_relationships_on_source_image_id"
    t.check_constraint "source_image_id <> related_image_id", name: "prevent_self_reference"
  end

  create_table "images", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.json "metadata", default: {}
    t.bigint "alias_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["alias_id"], name: "index_images_on_alias_id"
    t.index ["created_at"], name: "index_images_on_created_at"
    t.index ["title"], name: "index_images_on_title"
  end

  create_table "images_tags", id: false, force: :cascade do |t|
    t.bigint "image_id", null: false
    t.bigint "tag_id", null: false
    t.index ["image_id", "tag_id"], name: "index_images_tags_on_image_id_and_tag_id", unique: true
    t.index ["tag_id", "image_id"], name: "index_images_tags_on_tag_id_and_image_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_tags_on_name", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "jti", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "aliases", "users"
  add_foreign_key "image_relationships", "images", column: "related_image_id"
  add_foreign_key "image_relationships", "images", column: "source_image_id"
  add_foreign_key "images", "aliases"
end
