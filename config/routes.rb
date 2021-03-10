Rails.application.routes.draw do
  root "overview#index"
  get 'color_changer/current_state'
  get 'manage_stream/start'
  get 'manage_stream/stop'
end
