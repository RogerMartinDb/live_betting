require 'singleton'

# represents the current state of color after all changes have been applied
# analogous to full current live bets overview JSON
class ColorStateProjector
  include Singleton

  class ColorState
    attr_reader :color, :sum_of_all_changes, :sequence_number

    def initialize(color, sum_of_all_changes, sequence_number)
      @color = color
      @sum_of_all_changes = sum_of_all_changes
      @sequence_number = sequence_number
    end
  end

  def initialize
    @lock = Mutex.new
    @value = ColorState.new(0, 0, nil)
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
      @value = ColorState.new(@value.color ^ color_change,
                              @value.sum_of_all_changes + color_change,
                              sequence_number)
    }
  end
end
