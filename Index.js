var CardsCount = 30;
var PairsChecked = 0;  
var PairsFound = 0;    
var PairsLeft = CardsCount/2;
var LeaderboardId = 1;
$(document).ready(
    function()
    {
        
        restart();
        $( "#cardgame-container" )
            .resizable({
                aspectRatio: 2.38 / 1
            });

    }
)

function restart()
{
    
    var container = $("#cardgame-container");
    container.html("");
    container.off();
    container.on("resize",onResize);
    onResize()
    for(i = 0; i<CardsCount; i++)
    {
        container.append(
            $("<div/>")
                .addClass("a-card backside")
                .append(
                    $("<div/>")
                    .addClass("a-card-inside")
                    .css("display","none")
                    .css("background-image","url(Front/" + Math.floor(i/2) + ".svg)")

                )
        )
    }
    var cards = container.children();
      container.html(
          cards.sort(function()
              {
                  return 0.5 - Math.random()
              }
          )
      )
    $(".a-card").click(flipFaceUp);
    PairsChecked = 0;  
    PairsFound = 0;   
    PairsLeft = CardsCount/2;
    updateUI();
}

function saveToFile(content,filename)
{
    var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename + ".txt");
}

function onResize()
{
    var width = $("#cardgame-container").css("width");
    $("#game-size").html(width);
}


function onHalfFlip(target)
{
    $(target).children().toggle(0);
    $(target).toggleClass("flip");
    $(target).toggleClass("backside");
    $(target).off("transitionend");
}

function updateUI()
{
    $("#pairs-checked").html(PairsChecked)
    $("#pairs-found").html(PairsFound)
    $("#pairs-left").html(PairsLeft)
}

function flipFaceUp() 
{
    $(".a-card").off("click");
    $(this).on("transitionend", onHalfFlipUp);
    $(this).toggleClass("flip");
    
}

function onHalfFlipUp()
{
    onHalfFlip(this)
    $(this).on("transitionend", onFlipedUp);
}

function onFlipedUp()
{
    
    $(this).off("transitionend");
    var count = getFaceUpCartsCount();
    
    $(".a-card.backside").on("click", flipFaceUp);

    if(count % 2 == 0)
    {
        PairsChecked++
        if(areEqual())
        {
            PairsFound++
            PairsLeft--;
            $(".a-card:not(.matched):not(.backside)").addClass("matched")
        }
        else
        {
            flipFaceDownAll();
        }
        updateUI()
        if(PairsLeft==0)
        {
            var name = prompt("Congratulations! Please state your name");
            $(".leaderboard table").append(
                $("<tr/>")
                    .append(
                        $("<td/>")
                        .text(LeaderboardId + ". ")
                    )
                    .append(
                        $("<td/>")
                        .text(name)
                    )
                    .append(
                        $("<td/>")
                        .text($("#pairs-checked").text())
                    )
                )
            var content =     
                "Player: " + name + "\r\n" +
                $("#pairs-checked").parent().text()+ "\r\n" +
                $("#pairs-found").parent().text() + "\r\n";
            $(".leaderboard").show();
            LeaderboardId++;
            saveToFile(content,name);
            restart();
        }
    }
}


function flipFaceDownAll() 
{
    $(".a-card").off("click");
    var currentPair = $(".a-card:not(.backside):not(.matched)");
    currentPair.on("transitionend", onHalfFlipDownAll);
    currentPair.toggleClass("flip");
}

function onHalfFlipDownAll()
{
    onHalfFlip(this)
    $(this).on("transitionend", onFlipedDownAll);
}

function onFlipedDownAll()
{
    $(".a-card").off("click");
    $(".a-card:not(.matched)").on("click", flipFaceUp);
    $(this).off("transitionend");
}


function areEqual()
{
    var equality = false;
    var pair = $(".a-card:not(.matched):not(.backside)");
    var first = pair.first()
    var second = pair.last();
    return first.children().css("background-image") === 
        second.children().css("background-image");
}    

function getFaceDownCartsCount()
{
    return $(".a-card.backside").length;
}

function getFaceUpCartsCount()
{
    return $(".a-card:not(.backside)").length;
}