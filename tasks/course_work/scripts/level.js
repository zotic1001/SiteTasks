function startLevel1() {
    gameMode = "figure";
    show_correct_item_hide();
    startRound();
}
function startLevel2() {
    gameMode = "color";
    show_correct_item_hide();
    startRound();
}
function startLevel3() {
    gameMode = "number";
    show_correct_item_hide();
    startRound();
}
document.getElementById('level1-btn').addEventListener('click', function() {
    if (auth_user() == true) {
        startLevel1();
    };  
});
document.getElementById('level2-btn').addEventListener('click', function() {
    if (auth_user() == true) {
        startLevel2();
    };  
});
document.getElementById('level3-btn').addEventListener('click', function() {
    if (auth_user() == true) {
        startLevel3();
    };  
});