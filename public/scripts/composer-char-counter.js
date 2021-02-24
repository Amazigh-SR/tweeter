$(document).ready(function() {
  $("#tweet-text").on("input", function(Event) {
    const charCounter = this.value.length;
    const charRemaining = 140 - charCounter;
    let counterElement = $(Event.target).next("#under-text").find(".counter");
    counterElement.text(charRemaining);

    if (charRemaining < 0) {
      counterElement.css("color", "red");
    } else {
      counterElement.css("color", "#4056a1");
    }
  });
});
