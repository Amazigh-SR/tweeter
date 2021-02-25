/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
//Dummy Data
const data = [
  {
    user: {
      name: "Newton",
      avatars: "https://i.imgur.com/73hZDYK.png",
      handle: "@SirIsaac",
    },
    content: {
      text:
        "If I have seen further it is by standing on the shoulders of giants",
    },
    created_at: 1461116232227,
  },
  {
    user: {
      name: "Descartes",
      avatars: "https://i.imgur.com/nlhLi3I.png",
      handle: "@rd",
    },
    content: {
      text: "Je pense , donc je suis",
    },
    created_at: 1461113959088,
  },
];

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

//DOM related work - creation of a tweet tempate
$(document).ready(function() {
  //RenderTweets function loops through array of data

  const renderTweets = function(tweets) {
    $("#list-of-tweets").empty();
    // loops through tweets
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $("#list-of-tweets").append($tweet);
    }
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
  };

  renderTweets(data); // <--- May need to relocate

  //AJAX POST Request Function
  const pushTweet = function(data) {
    $.ajax({
      url: "/tweets",
      method: "POST",
      data,
    }).then((response) => {
      console.log(response);
    });
  };

  //Form submission handler
  $("#form").on("submit", function(event) {
    //prevent the default behavior of the form submission
    event.preventDefault();
    const $data = $(this).serialize();
    pushTweet($data);
    $(this).children("textarea").val("");
  });
});
