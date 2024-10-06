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
        
        // Event listener for "Yes" button
        $('#good-day').on('click', function() {
            $('#mood-response')
                .css({
                    'opacity': 1, 
                    'visibility': 'visible' 
                })
                .text("Yippee!")
                .animate({ opacity: 1 }, 1000) // Fade in
                .animate({ opacity: 0 }, 5000, function() {
                    $(this).css('visibility', 'hidden'); // Keep space but hide
                });
            
            // Trigger confetti effect
            confetti({
                particleCount: 777,
                spread: 180,
                origin: { y: 0.6 },
                zIndex: 9999,
                scalar: 3.0,
                gravity: 1.23456789,
                startVelocity: 77
            });

            $('#good-day, #bad-day').hide(); 
        });

        // Event listener for "No" button
        $('#bad-day').on('click', function() {
            $('#mood-response')
                .css({
                    'opacity': 0,
                    'visibility': 'visible'
                })
                .text("Sorry to hear, I hope your day gets better ❤️‍🩹")
                .animate({ opacity: 1 }, 2000); // Slow fade-in over 2 seconds
            $('#good-day, #bad-day').hide();
        });


    // Weather form submission
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

    // Background change
    function changeBackground(imageUrl) {
        const tempBackground = $('<div>').css({
            'position': 'fixed',
            'top': 0,
            'left': 0,
            'width': '100%',
            'height': '100%',
            'background-image': 'url(' + imageUrl + ')',
            'background-size': 'cover',
            'background-position': 'center',
            'z-index': -1,
            'opacity': 0
        }).appendTo('body');

        tempBackground.animate({ opacity: 1 }, 2000, function() {
            $('body').css('background-image', 'url(' + imageUrl + ')');
            tempBackground.fadeOut(500, function() {
                $(this).remove();
            });
        });
    }
    
    $('#day-theme').on('click', function() {
        changeBackground('/static/media/blissrise.jpg'); 
    });
    
    $('#afternoon-theme').on('click', function() {
        changeBackground('/static/media/bliss.jpg'); 
    });
    
    $('#night-theme').on('click', function() {
        changeBackground('/static/media/blissnight.jpg'); 
    });
});
