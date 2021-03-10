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
    current_projecton = ColorStateProjection.instance

    @worker = Thread.new do
      while @go do
        event = next_event
        ActionCable.server.broadcast('color_stream', event)
        current_projecton.apply_change(event)
      end
    end
  end

  def next_event
    sleep 2
    @sequence += 1
    color_change = Random.new.rand(1..10)
    ColorChangeEvent.new(@sequence, color_change)
  end
end
