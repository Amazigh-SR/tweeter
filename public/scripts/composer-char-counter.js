$(document).ready(function() {
  $("#tweet-text").on("input", function(Event) {
    const charCounter = this.value.length;
    const charRemaining = 140 - charCounter;
    //Select the output element and change its text to charRemaining
    let counterElement = $(Event.target).next("#under-text").find(".counter");
    counterElement.text(charRemaining);

    //If the number of characters exceeds 140 then turn the counter to red
    if (charRemaining < 0) {
      counterElement.css("color", "red");
    } else {
      counterElement.css("color", "#4056a1");
    }
  });
});
