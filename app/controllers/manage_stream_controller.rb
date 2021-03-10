class ManageStreamController < ApplicationController
  def start
    ColorStream.instance.start
    render plain: 'started'
  end

  def stop
    ColorStream.instance.stop
    render plain: 'stopped'
  end
end
