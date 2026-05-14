
window.onload = function () {
    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() / 2) {
            $(".BackToTop_buttonContainer__GQast").addClass('active');
        } else {
            $(".BackToTop_buttonContainer__GQast").removeClass('active');
        }
    });
    $(".BackToTop_jumpingButton__MI8to").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 250);
    });

    $("#menuButton").on('click', function () {
        if ($(this).hasClass("close")) {
            //close menu
            $(this).removeClass("close").addClass("open");
            $("#mainNav").attr("class", "Sidebar_main___ex0V Sidebar_isDesktop__aieVO Sidebar_hidden__ARber");
            $("#layoutMain").attr('class', "css-1ajjotx")
        } else {
            //open menu
            $(this).addClass("close").removeClass("open");
            $("#mainNav").attr('class', "Sidebar_main___ex0V Sidebar_isDesktop__aieVO");
            $("#layoutMain").attr('class', "css-t2sft")
        }
    })

    $("#button-favorites").on('click', function () {
        $(".css-18ji4f7").toggleClass("active");
        $("#panel-favorites").toggleClass("active");
        loadStorageGames()
    })


    $("#close-favorites").on("click", function () {
        $(".css-18ji4f7").removeClass("active");
        $("#panel-favorites").removeClass("active");
    })

    $(".css-18ji4f7").on('click', function () {
        $("#panel-favorites").removeClass("active");
        $(this).removeClass("active");
    })
    if (typeof (gamecontrols) != 'undefined') {
        $("#game-controls-toggle-button").on('click', function () {
            $(this).addClass('active');
            $("#game-controls").toggle();
            if ($("#game-controls").is(":hidden")) {
                $(this).removeClass("active")
            }
        })

        $("#close__game-controls").on('click', () => {
            $("#game-controls").hide();
            $("#game-controls-toggle-button").removeClass("active")
        })

        $("#likeGame").on('click', function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                sendVoteRequest('like', 0)
                updateLikes(0)
                favoritesStorage.removeLikeGame(game_slug);
            } else {
                $(this).addClass("active")
                $("#dislikeGame").removeClass("active")
                sendVoteRequest('like', 1)
                updateLikes(1)
                favoritesStorage.addLikeGame({
                    id: id_game,
                    slug: game_slug,
                    name: game_name,
                    image: game_image
                })
                favoritesStorage.removeDislikeGame(game_slug)
            }
            loadStorageGames()
        })

        $("#dislikeGame").on('click', function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                sendVoteRequest('dislike', 0)
                favoritesStorage.removeDislikeGame(game_slug);
            } else {
                $(this).addClass("active")
                sendVoteRequest('dislike', 1)
                favoritesStorage.addDislikeGame(game_slug)
                favoritesStorage.removeLikeGame(game_slug);
                if ($("#likeGame").hasClass("active")) {
                    $("#likeGame").removeClass("active");
                    sendVoteRequest('like', 0)
                    updateLikes(0);
                }
            }
            loadStorageGames()
        })

        $("#addFavoritesGame").on('click', function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $(this).attr('data-content', "Add to favorites")
                favoritesStorage.removeFavoritesGame(game_slug);
            } else {
                $(this).addClass("active")
                $(this).attr('data-content', "Remove from favorites")
                favoritesStorage.addFavoritesGame({
                    id: id_game,
                    slug: game_slug,
                    name: game_name,
                    image: game_image
                });
            }
            loadStorageGames()
        })

        $("#expand").on('click', function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $("body").removeClass("fullscreen");
            } else {
                $(this).addClass("active");
                $("body").addClass("fullscreen");
            }
        });
        $("#feedBackGame").on('click', function () {
            scrollToDiv("#append-comment")
        })
        $("#_exit_full_screen").on('click', cancelFullScreen);

        //hide report
        $("#report-close, #report-layer").on('click', function () {
            $("#report-layout").hide();
            $("#report-layer").hide();
            $("#report-form").hide();
        })

        //show report
        $("#reportGame").on('click', function () {
            $("#report-layout").show();
            $("#report-layer").show();
            $("#report-form").show();
        })

        //hide share
        $("#share-close, #share-layer").on('click', function () {
            $("#share-layout").hide();
            $("#share-layer").hide();
            $("#share-form").hide();
        })

        //show share
        $("#shareGame").on('click', function () {
            $("#share-layout").show();
            $("#share-layer").show();
            $("#share-form").show();
        })

        function validateForm() {
            const issue = $('#report_select').val();
            const message = $('textarea[name="game[message]"]').val().trim();

            const isValid = issue !== '' && message.length >= 20;

            // Show/hide error message
            if (message.length < 20 && message.length > 0) {
                $('#report-error-message').show();
            } else {
                $('#report-error-message').hide();
            }
            if (isValid) {
                $('.css-1osun8m').prop('disabled', !isValid).removeClass("Mui-disabled");
            } else {
                $('.css-1osun8m').prop('disabled', !isValid).addClass("Mui-disabled");
            }
        }

        $('#report_select, textarea[name="game[message]"]').on('change input', validateForm);
        $('.css-1osun8m').on('click', function () {
            $('#form-resport').submit();
        })
        // Form submission
        $('#form-resport').on('submit', function (e) {
            e.preventDefault();
            const issue = $('#report_select').val();
            const message = $('textarea[name="game[message]"]').val().trim();
            if (issue == '') {
                $('#report-error-message').text('Please select an issue').show();
                return;
            }
            if (message.length < 20) {
                $('#report-error-message').text('Your message must contain at least 20 characters').show();
                return;
            }
            const gameName = $('input[name="game[name]"]').val().trim();
            const email = $('input[name="game[email]"]').val().trim();
            const formData = {
                'game[name]': gameName,
                'game[issue]': issue,
                'game[email]': email,
                'game[message]': message,
                'game[url]': location.href
            };

            $.ajax({
                url: '/report.ajax',
                type: 'POST',
                data: formData,
                success: function (response) {
                    $('#report-error-message').text('Report sent successfully!').css('color', 'green').show();
                    $('.css-1osun8m').prop('disabled', true).addClass("Mui-disabled");
                    $('#report_select').val('')
                    $('textarea[name="game[message]"]').val('')
                    $('input[name="game[email]"]').val('')
                    $('#report_select').val('')
                    setTimeout(() => {
                        $('#report-error-message').hide();
                        $('#report-error-message').text('Your message must contain at least 20 characters').css("color", "rgb(231, 13, 92)")
                    }, 3000)
                },
                error: function (xhr, status, error) {
                    $('#report-error-message').text('Failed to send report. Please try again.').css('color', 'rgb(231, 13, 92)').show();
                }
            });
        });
    } else {
        $(".css-1x843ir").on('click', function () {
            $("#button-favorites").click();
            $("#recent-button").click();
        })
    }
}


function copyToClipboard(e, t) {
    var s = $("<input>");
    $("body").append(s),
        $(e).select(),
        document.execCommand("copy")
    // , $(t).html("Copied!!"), setTimeout((function () {
    //     $(t).html("Copy")
    // }), 3e3), s.remove()
}

function loadStorageGames() {
    loadRecentStorageGame();
    loadFavStorageGame();
    loadLikesStorageGame();
}


function paging(p = 2) {
    $(".css-18ji4f7").addClass("active");
    let url = "/paging.ajax";
    $.ajax({
        url: url,
        type: "POST",
        data: {
            page: p,
            keywords: keywords,
            field_order: field_order,
            order_type: order_type,
            category_id: category_id,
            is_hot: is_hot,
            is_new: is_new,
            is_trending: is_trending,
            tag_id: tag_id,
            limit: limit,
        },
        success: function (response) {
            $(".css-18ji4f7").removeClass("active");
            if (response) {
                $("#ajax-append").html(response);
                $("html, body").animate({ scrollTop: 0 }, 0);
				initThumbHover(document);
            }
        }
    })
}

function loadFavStorageGame() {
    let games = favoritesStorage.arrayFavoritesStorage;
    let html = buildMyGamesHtml(games, 'favorites');
    pushToMyGames(html, "#favorites-layout");
}

function loadRecentStorageGame() {
    let games = favoritesStorage.arrayRecentStorage;
	if(games.length){
		games = games.reverse();
	}
    let html = buildMyGamesHtml(games, 'recent');
    pushToMyGames(html, "#recent-layout");
}

function loadLikesStorageGame() {
    let games = favoritesStorage.arrayLikesStorage;	
    let html = buildMyGamesHtml(games, 'likes');
    pushToMyGames(html, "#likes-layout");
}

function buildMyGamesHtml(gamesList = [], repository = null) {
    let html = '';
    if (!gamesList.length) {
        return '<div class="css-h0cm5o"><div style="padding-left: 32px; padding-right: 32px; margin-top: 8px;"><div class="css-11o2ve7">No games found!</div></div></div>';
    }
    html += '<div class="css-b45qhy">';
    html += '<div class="css-1ckqyej">';
    for (let t of gamesList) {
        html += `<a class="css-y8aj3r GameThumb_gameThumbLinkDesktop__wcir5 GameThumb_isResponsiveGrid__b4QQf css-y8aj3r game-thumb-test-class" href="/${t.slug}">
        <div class="GameThumb_closeBtnContainer__84qjx" onclick="removeGameStorage(this,event)" data-slug="${t.slug}" data-action="${repository}">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" class="css-6qu7l6">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L12 10.5858L18.2929 4.29289C18.6834 3.90237 19.3166 3.90237 19.7071 4.29289C20.0976 4.68342 20.0976 5.31658 19.7071 5.70711L13.4142 12L19.7071 18.2929C20.0976 18.6834 20.0976 19.3166 19.7071 19.7071C19.3166 20.0976 18.6834 20.0976 18.2929 19.7071L12 13.4142L5.70711 19.7071C5.31658 20.0976 4.68342 20.0976 4.29289 19.7071C3.90237 19.3166 3.90237 18.6834 4.29289 18.2929L10.5858 12L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289Z"></path>
            </svg>
        </div>
        <div class="GameThumb_gameThumbTitleContainer__J1K4D gameThumbTitleContainer">${t.name}</div>
        <div class="GameThumb_gradientVignette__Q04oZ"></div>
        <img class="GameThumb_gameThumbImage__FSasr" loading="lazy" src="${t.image}" alt="Play ${t.name} game" title="${t.name} game" width="273" />
    </a>`;
    }
    html += '</div>';
    html += '</div>';
    return html;
}

function pushToMyGames(html, id) {
    document.querySelector(id).innerHTML = html;
}

function removeGameStorage(me, e) {
    e.preventDefault();
    let action = me.getAttribute("data-action");
    let game_slug = me.getAttribute("data-slug");
    let parent = me.parentNode;
    parent.remove();
    switch (action) {
        case 'favorites':
            favoritesStorage.removeFavoritesGame(game_slug);
            $("#addFavoritesGame").removeClass('active')
            break;
        case 'likes':
            favoritesStorage.removeLikeGame(game_slug);
            $("#likeGame").removeClass('active')
            break;
        case 'recent':
            favoritesStorage.removeRecentGame(game_slug);
            break;
        default:
    }
}

function updateLikes(value) {
    let like_value = parseInt($("#likeGame").attr("data-like"));
    if (value == 0) {
        like_value -= 1;
    } else {
        like_value += 1;
    }
    $(".css-re3xxe").html(convertNumberToKMB(like_value))
}
function convertNumberToKMB(num) {
    if (typeof num !== 'number') {
        return num; // Trả về nguyên gốc nếu không phải số
    }

    const absNum = Math.abs(num); // Lấy giá trị tuyệt đối để xử lý số âm dễ hơn

    if (absNum >= 1_000_000_000) { // Hàng tỷ (Billion)
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (absNum >= 1_000_000) { // Hàng triệu (Million)
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (absNum >= 1_000) { // Hàng nghìn (Thousand)
        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }

    return num.toString(); // Trả về số nguyên nếu nhỏ hơn 1000
}
function sendVoteRequest(action, value) {
    $.ajax({
        url: "/vote.ajax",
        type: "POST",
        data: { action: action, id: id_game, value: value },
        success: function (xhr) {

        }
    })
}




function scrollToDiv(element) {
    if ($(element).length) {
        $('html,body').animate({ scrollTop: $(element).offset().top - 100 }, 'slow');
    }
}
function closeBox() {
    $(".close-sharing-box").hide();
    $(".clipboard-share").addClass("hide-zindex");
}

function showSharingBox() {
    $(".close-sharing-box").show();
    $(".clipboard-share").removeClass("hide-zindex");
}

function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function cancelFullScreen() {
    $("#_exit_full_screen").addClass('hidden');
    $("#iframehtml5").removeClass("force_full_screen");
    var requestMethod = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.exitFullScreenBtn;
    if (requestMethod) { // cancel full screen.
        requestMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
}

function exitHandler() {
    if (document.webkitIsFullScreen === false
        || document.mozFullScreen === false
        || document.msFullscreenElement === false) {
        cancelFullScreen();
    }
}