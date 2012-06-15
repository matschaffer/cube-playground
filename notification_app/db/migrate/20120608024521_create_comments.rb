class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.belongs_to :post
      t.text :body

      t.timestamps
    end
    add_index :comments, :post_id
  end
end
