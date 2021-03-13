require 'singleton'

class ColorStream
  include Singleton

  def initialize
    @go = false
    @sequence = 0
  end

  def stop
    @go = false
    @worker.join unless @worker.nil?
  end

  def start
    return if @go
    @go = true
    do_work
  end

  private

  def do_work
    current_projecton = ColorStateProjector.instance

    @worker = Thread.new do
      while @go do
        event = next_event
        ActionCable.server.broadcast('color_stream', event)
        current_projecton.apply_change(event)
      end
    end
  end

  MAX_RGB = 256 ** 3 - 1

  def next_event
    sleep 0.1
    @sequence += 1
    #color_change = Random.new.rand(1..MAX_RGB)
    color_change = 2 ** Random.new.rand(0..23)
    ColorChangeEvent.new(@sequence, color_change)
  end
end
