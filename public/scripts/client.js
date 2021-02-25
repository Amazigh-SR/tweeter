/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//Helper function to determine how much time "ago"
const timeDifference = function(current, previous) {
  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let msPerMonth = msPerDay * 30;
  let msPerYear = msPerDay * 365;

  let elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return "Approximately " + Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return "Approximately " + Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return "Approximately " + Math.round(elapsed / msPerYear) + " years ago";
  }
};

//Function that generates a tweet tempate with all the necessary classes
const createTweetElement = function(data) {
  const $article = $("<article>").addClass("tweet"); //1
  const $header = $("<header>"); //2 append to article
  const $divA = $("<div>").addClass("identification"); //3 append to header
  const $divB = $("<div>").addClass("avatar-details"); //append to divA
  const $img = $("<img>")
    .addClass("avatar-logo")
    .attr("src", data.user.avatars); //Append to div B
  const $userName = $("<span>").text(data.user.name); //Append to divB
  const $replyUserName = $("<span>")
    .addClass("reply-username")
    .text(data.user.handle); //Append to divA
  const $content = $("<p>").text(data.content.text); //Append to header
  const $footer = $("<footer>"); //Append to article
  const $time = $("<span>")
    .addClass("time-stamp")
    .text(timeDifference(Date.now(), data.created_at)); //Append to footer
  const $icons = $("<span>").addClass("tweet-icons").text("⚑ ❄︎ ❤︎"); //Append to footer

  $divB.append($img, $userName);
  $divA.append($divB, $replyUserName);
  $header.append($divA, $content);
  $footer.append($time, $icons);
  $article.append($header, $footer);

  return $article;
};

//----------------DOM related work------------------------//
$(document).ready(function() {
  //RenderTweets function loops through array of data
  const renderTweets = function(tweets) {
    $("#list-of-tweets").empty();
    // loops through tweets
    for (const tweet of tweets) {
      // calls createTweetElement for each tweet
      const $tweet = createTweetElement(tweet);
      // takes return value and appends it to the tweets container
      $("#list-of-tweets").prepend($tweet);
    }
  };

  //AJAX POST Request Function utilized by the form handler below
  const pushTweet = function(data) {
    $.ajax({
      url: "/tweets",
      method: "POST",
      data,
    }).then(() => {
      loadTweets();
    });
  };

  //Form submission handler
  $("#form").on("submit", function(event) {
    const $input = $(this).children("textarea").val();
    if ($input === "") {
      event.preventDefault();
      $(".error-message").removeClass("invisible");
      $(".error-type").text("Empty Tweet Submission!");
    } else if ($input.length > 140) {
      event.preventDefault();
      $(".error-message").removeClass("invisible");
      $(".error-type").text("Exceeded Chars Limit!");
    } else {
      //prevent the default behavior of the form submission
      event.preventDefault();
      //Add back the invisible class
      $(".error-message").addClass("invisible");
      //extract the input and convert into key/value pair
      const $data = $(this).serialize();
      //Ajax POST request
      pushTweet($data);
      //reset the inputs after submission
      $(this).children("textarea").val("");
      $(".counter").text("140");
    }
  });

  //Get request that fetches the data then renders it
  const loadTweets = function() {
    $.ajax({
      url: "/tweets",
      method: "GET",
      dataType: "json",
      success: (tweets) => {
        renderTweets(tweets);
      },
      error: (error) => {
        console.log(error);
      },
    });
  };
});
