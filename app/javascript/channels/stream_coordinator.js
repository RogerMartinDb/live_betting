export {streamCoordinator}

const streamCoordinator = {
  processingMode: null,
  projectionHandler: null,
  eventHandler: null,
  projectionLocation: null,
  onConnectedChange: null,
  onProcessingModeChange: null,

  debugFakeDisconnect: false,

  lastPolledSequenceNumber: null,
  lastStreamedSequenceNumber: null,
  eventBuffer: [],

  startDebugFakeDisconnect: function() {
    this.debugFakeDisconnect = true;
    this.connectedChange('disconnected');
  },

  endDebugFakeDisconnect: function() {
    this.debugFakeDisconnect = false;
    this.connectedChange('connected');
  },

  start: function() {
    this.setMode("polling");

    this.pollIfNeeded();
    window.setInterval(this.pollIfNeeded, 5000);
  },

  setMode: function(mode) {
    if (this.processingMode == mode)
      return;

    this.processingMode = mode;

    if (this.onProcessingModeChange != null)
      this.onProcessingModeChange(mode);
  },

  pollIfNeeded: function() {
    if (streamCoordinator.processingMode != "polling")
      return;

    fetch(streamCoordinator.projectionLocation)
      .then(response => response.json())
      .then(projectionState => {
        streamCoordinator.projectionHandler(projectionState);
        streamCoordinator.lastPolledSequenceNumber = projectionState.sequence_number;
        console.log(`polled projection at ${projectionState.sequence_number}`)
      });
  },

  processStreamEvent: function(event) {
    if (this.debugFakeDisconnect)
          return;

    let thisSequence = event.sequence_number;
    let lastSequence = this.lastStreamedSequenceNumber || (thisSequence - 1);

    if (lastSequence != thisSequence - 1) {
      console.error(`stream integrity fault, last sequence ${lastSequence}, this sequence ${thisSequence}. Resetting buffer and polling.`)
      this.eventBuffer = [];
      this.setMode('polling');
    }

    this.lastStreamedSequenceNumber = event.sequence_number;

    if (this.processingMode == "polling"){
      this.eventBuffer.push(event);
      console.log(`buffering event ${event.sequence_number}`)

      if (this.eventBuffer[0].sequence_number <= this.lastPolledSequenceNumber + 1) {
        this.setMode("streaming");
        console.log('matched polled projection to stream, switching to streaming mode')

        this.eventBuffer.forEach(bufferedEvent => {
          if (bufferedEvent.sequence_number >= this.lastPolledSequenceNumber + 1){
            this.eventHandler(bufferedEvent);
            console.log(`applied buffered event ${bufferedEvent.sequence_number}`);
          }
          else {
            console.log(`skipping bufferend event ${bufferedEvent.sequence_number}`);
          }
        })

        this.eventBuffer = [];
      }
    }
    else {
      this.eventHandler(event);
      console.log(`applied streamed event ${event.sequence_number}`)
    }
  },

  connectedChange: function(connection_state) {
    if (connection_state == 'disconnected')
      this.setMode('polling');

    if (this.onConnectedChange != null)
      this.onConnectedChange(connection_state);
  }
}

