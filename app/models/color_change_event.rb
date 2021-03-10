# event steam item that represents a change to the current color state
# analogous to one small change to the live bets overview
class ColorChangeEvent
  attr_reader :sequence_number, :color_change

  def initialize(sequence_number, color_change)
    @sequence_number = sequence_number
    @color_change = color_change
  end
end
