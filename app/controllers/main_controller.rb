#encoding=UTF-8
class MainController < ApplicationController
  protect_from_forgery :except => :login_check
  #  before_filter :login_filter,:only => [:login, :login_check, :signup, :user_create]

  # 登录页
  def login;
  end

  # 登录验证
  #
  # 2: 参数错误
  # 0: 成功
  # 1：失败
  def login_check
    login_name = params[:name]
    password = params[:password]
    flag = nil
    if Member.valid_use_login_params(login_name, password)
      member = Member.login_check(login_name, password)
      if member.blank?
        # 登录失败
        flag = 1
      else
        do_login(member)
        flag = 0
      end
    else
      # 参数非法
      flag = 0
    end
    respond_to do |format|
      format.html do
        redirect_to root_path and return
      end
      format.json { render :json => {:success => flag} }
    end
  end

  # 注册页
  def signup
    @member = Member.new
  end

  # 用户注册提交
  def user_create
    user = params[:member][:user]
    password = params[:member][:password]
    passagain = params[:member][:member_passagain]
    realname = params[:member][:realname]
    tel = params[:member][:tel]
    address = params[:member][:address]
    @member = Member.new(:user => user,
                         :password => Member.encrypt_password(password),
                         :realname => realname,
                         :tel => tel,
                         :address => address
    )
    if @member.save
      #成功
      member = Member.login_check(user, password)
      respond_to do |format|
        format.json do
          if @member
            do_login(member)
            render :json => {:success => 0, :go_url => root_path}
          else
            render :json => {:success => 1}
          end
        end
      end
    else
      redirect_to :back and return
    end
  end

  #验证登录名
  def check_login
    user = params[:member][:user]
    render :text => Member.check_login_exist(user) ? "false" : "true"
  end

  # 首页

  def index
  end

  # 注销
  def logout
    session[:member_id] = nil

    redirect_to "/" and return
  end

  protected

  # 登录
  def do_login(member)
    session[:member_id] = member.id
  end
end