require "test_helper"

class ColorChangerControllerTest < ActionDispatch::IntegrationTest
  test "should get current_state" do
    get color_changer_current_state_url
    assert_response :success
  end
end
