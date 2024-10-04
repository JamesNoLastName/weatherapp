// script.js
function displayGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const currentTime = `${hour}:${minutes}:${seconds}`;
    let greeting;

    if (hour < 12) {
        greeting = `Good Morning! The time is ${currentTime}`;
    } else if (hour < 18) {
        greeting = `Good Afternoon! The time is ${currentTime}`;
    } else {
        greeting = `Good Evening! The time is ${currentTime}`;
    }

    $('#greeting').text(greeting);
}

$(document).ready(function() {
    displayGreeting();
    setInterval(displayGreeting, 1000);

    $('#mood-response').text("Let us know how your day was!");

    $('#good-day').on('click', function() {
        $('#mood-response').text("Yippee");
        $('#good-day, #bad-day').hide(); 
    });

    $('#bad-day').on('click', function() {
        $('#mood-response').text("Sorry to hear, I hope your day gets better ❤️‍🩹");
        $('#good-day, #bad-day').hide();
    });

    $('#weather-form').on('submit', function(event) {
        event.preventDefault();
        var city = $('#city').val();
        var state = $('#state').val();
        $('#error-message').hide(); 

        $.ajax({
            type: 'POST',
            url: '/weather',
            data: { city: city, state: state },
            success: function(data) {
                if (data.error) {
                    $('#error-message').text(data.error).show();
                    $('#weather-result').hide();
                } else {
                    $('#city-name').text(data.city);
                    $('#region-name').text(data.region);
                    $('#temperature').text(data.temperature + ' °C');
                    $('#description').text(data.description);
                    $('#humidity').text(data.humidity + '%');
                    $('#pressure').text(data.pressure + ' hPa');

                    if (data.rain) {
                        $('#rain-message').text(`It's raining with ${data.rain} mm in the last hour.`);
                        $('#rain-info').show();
                    } else {
                        $('#rain-info').hide();
                    }

                    $('#weather-result').show();
                }
            },
            error: function() {
                $('#error-message').text('An unexpected error occurred. Please try again.').show();
                $('#weather-result').hide();
            }
        });
    });
});
