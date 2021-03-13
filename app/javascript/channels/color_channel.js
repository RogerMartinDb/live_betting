import consumer from "./consumer"
import {streamCoordinator} from "./stream_coordinator"

window.streamCoordinator = streamCoordinator;

consumer.subscriptions.create("ColorChannel", {
  connected() {
    window.streamCoordinator.connectedChange('connected');
  },

  disconnected() {
    window.streamCoordinator.connectedChange('disconnected');
  },

  received(data) {
    window.streamCoordinator.processStreamEvent(data);
  }
});
