class ColorChangerController < ApplicationController
  def current_state
    expires_in 5.seconds, public: true

    render json: ColorStateProjection.instance.color_state.as_json
  end
end
