class ProductsController < ApplicationController

  def index
  end

  def form
    render partial: 'form'
  end
end
