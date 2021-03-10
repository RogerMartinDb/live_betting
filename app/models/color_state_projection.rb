require 'singleton'

# represents the current state of color after all changes have been applied
# analogous to full current live bets overview JSON
class ColorStateProjection
  include Singleton

  ColorState = Struct.new(:color, :sum_of_all_changes, :sequence_number, keyword_init: true)

  def initialize
    @lock = Mutex.new
    @value = ColorState.new(color: 0, sum_of_all_changes: 0)
  end

  def color_state
    @lock.synchronize {
      @value.dup
    }
  end

  def apply_change(color_change_event)
    sequence_number = color_change_event.sequence_number
    color_change = color_change_event.color_change

    @lock.synchronize {
      @value = ColorState.new(color:              @value.color ^ color_change,
                              sum_of_all_changes: @value.sum_of_all_changes + color_change,
                              sequence_number:    sequence_number)
    }
  end
end
