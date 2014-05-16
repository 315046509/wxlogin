#encoding:UTF-8
class Member < ActiveRecord::Base
  has_many :babies
  validates :user, :presence => {:message => "用户名不能为空"},
            :uniqueness => {:message => "用户名以存在！"},
            :length => {:minimum => 6, :maximum => 20, :message => "用户名长度应在6至20个字符之间"}
  validates :password, :presence => {:message => "密码不能为空"},
            :length => {:minimum => 6, :maximum => 254, :message => "密码至少6个字符"}
  validates :realname, :presence => {:message => "真实姓名不能为空"},
            :length => {:minimum => 2, :maximum => 10, :message => "请填写真实姓名"}
  validates :tel, :presence => {:message => "请填写真实手机号码！"}
  validates_format_of :tel, :multiline => true, :message => "手机号码不正确!", :with => /^(13[0-9]|15[0-9]|18[0-9])\d{8}$/

  # 密码加密
  def self.encrypt_password(password)
    Digest::MD5.hexdigest(password)
  end

  # 验证用户登录参数
  def self.valid_use_login_params(login_name, password)
    if (login_name.blank? || password.blank?)
    else
      return true
    end
  end

  # 验证登录
  def self.login_check(user, password)
    encrypt_password = Member.encrypt_password(password)
    return Member.where(:user => user, :password => encrypt_password).first
  end

  # 检查登录名是否存在
  def self.check_login_exist(user)
    accounts = Member.where(:user => user)
    accounts.blank? ? false : true
  end
end