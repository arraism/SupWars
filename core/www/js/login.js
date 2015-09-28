$("#btnRegister").on("click",function (event) {
            event.preventDefault();
            $("#register").show();
        });

$("#BtnRegist").on("click",function (event) {
    event.preventDefault();
    
    login=  $("#registerLogin").val();
    password= $("#registerPassword").val();
    mail= $("#registerEmail").val();
    if (login != "" && password != "" && mail != ""){
        $.ajax({
            url: "/register",
            method: "POST",
            data: "login="+login+"&password="+password+"&mail="+mail,
            success: function(data){
                $("#register").hide();
                $("#login").focus();
                $("#alert").addClass("alert-success")
                .html("User registered")
                .fadeIn(1000)
                .fadeOut(1000);

            },
            error: function(data){
                alert("an error was occured");
            }
        });
        
    } else {
        alert("Please complete the form");
    }

});