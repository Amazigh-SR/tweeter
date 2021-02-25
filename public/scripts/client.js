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

//Function that generates a tweet tempate
const createTweetElement = function(data) {
  const $tweet = $(`
  <article class="tweet">
    <header>
      <div class="identification">
        <div class = "avatar-details"><img class="avatar-logo"  src = "${
  data.user.avatars
}"/><span> ${data.user.name}</span></div>
        <span class="reply-username"> ${data.user.handle}</span>
      </div>
      <p>${data.content.text}</p>
    </header>
    <footer>
      <span class="time-stamp">${timeDifference(
    Date.now(),
    data.created_at
  )}</span>
      <span class="tweet-icons"> ⚑ ❄︎ ❤︎</span>
    </footer>
  </article>
  `);
  return $tweet;
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
    //prevent the default behavior of the form submission
    event.preventDefault();
    //extract the input and convert into key/value pair
    const $data = $(this).serialize();
    //Ajax POST request
    pushTweet($data);
    //reset the inputs after submission
    $(this).children("textarea").val("");
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
