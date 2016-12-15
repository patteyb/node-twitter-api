$('#tweet-textarea').keydown(function(){

    if(this.value.length >= 140){
        $("#tweet-char").html("STOP!");;
    } else {
        $("#tweet-char").html(140 - this.value.length);
    }
});