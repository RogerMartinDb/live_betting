import consumer from "./consumer"

consumer.subscriptions.create("ColorChannel", {
  connected() {
    document.getElementById("stream_connection_state").innerText = "connected";
  },

  disconnected() {
    document.getElementById("stream_connection_state").innerText = "disconnected";
  },

  received(data) {
    let old_color = parseInt(document.getElementById("current_color").innerText) || 0
    let new_color = old_color ^ data.color_change

    let old_total = parseInt(document.getElementById("current_total").innerText) || 0
    let new_total = old_total + new_color

    document.getElementById("current_color_indicator").style.backgroundColor = this.toColorString(new_color)
    document.getElementById("current_color").innerText = new_color
    document.getElementById("current_total").innerText = new_total.toString()

    let log_info = {new_color: new_color, new_total: new_total}
    console.log({...data, ...log_info})
  },

  toColorString(color) {
    let b = this.lastByteAsHex(color)
    color >>= 8
    let g = this.lastByteAsHex(color)
    color >>= 8
    let r = this.lastByteAsHex(color)

    return `#${r}${g}${b}`
  },

  lastByteAsHex(n) {
    n &= 255
    if (n < 16)
      return '0' + n.toString(16);

    return n.toString(16);
  }
});
