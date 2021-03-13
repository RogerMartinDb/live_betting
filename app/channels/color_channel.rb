class ColorChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'color_stream'
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
