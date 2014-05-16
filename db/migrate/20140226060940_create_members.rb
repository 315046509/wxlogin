class CreateMembers < ActiveRecord::Migration
  def change
    create_table :members do |t|
      t.string :user
      t.string :password
      t.string :realname
      t.string :tel
      t.string :address

      t.timestamps
    end
  end
end
