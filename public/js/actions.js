

$(function(){
    //close flash messages
    $("#message_container").on('click', "i.close.icon", function(event){
        event.preventDefault();
        console.log("click on listener works");
        $(this).parent().fadeOut(450, function(){
            $(this).remove();
        });
        //cancels parent events,
        event.stopPropagation();
    });
    
    
    //switch state and required prop on change of checkbox 
    $(".stillEmployed").on('change', function() {
        if ($(this).prop('checked')) {
            $("#istenCikis").val("YYYY-MM-DD");
            $("#istenCikis").prop( "disabled", true );
            $("#istenCikis").prop( "required", false );
        } else {
            $("#istenCikis").prop( "disabled", false );
            $("#istenCikis").prop( "required", true );
            var new_limit = $("#IseGiris").val()
            $('#istenCikis').attr('min', new_limit);
        }
    });
    
    
    
    //updating district list based on selected city on new page
    $("#dropdownEmpIl").on('change', function() {
        //activate the ilce dropdown
        $("#dropdownEmpIlce").attr("disabled", false);
    
        if ($(this).val()==="İstanbul"){
            $("#dropdownEmpIlce").html("<option class='item' value='Kadıköy'>Kadıköy</option> <option class='item' value='Şişli'>Şişli</option>")
        } else if ($(this).val()==="Ankara"){
            $("#dropdownEmpIlce").html("<option class='item' value='Sincan'>Sincan</option> <option class='item' value='Çankaya'>Çankaya</option>")
        } else {
            $("#dropdownEmpIlce").html("<option class='disabled item' value=''>İlçe</option> ")
        }
    })
    
    var data = {"İller": [{name: "İstanbul", childs: [{name: "Kadıköy"}, {name:"Şişli"}]}, {name: "Ankara", childs: [{name: "Sincan"}, {name:"Çankaya"}]} ]}
    
    //updating district list based on selected city on edit page
    $("#dropdownEmpIl").attr("value", function() {
        //activate the ilce dropdown
        $("#dropdownEmpIlce").attr("disabled", false);
    
        if ($(this).val()==="İstanbul"){
            $("#dropdownEmpIlce").html("<option class='item' value='Kadıköy'>Kadıköy</option> <option class='item' value='Şişli'>Şişli</option>")
        } else if ($(this).val()==="Ankara"){
            $("#dropdownEmpIlce").html("<option class='item' value='Sincan'>Sincan</option> <option class='item' value='Çankaya'>Çankaya</option>")
        } else {
            $("#dropdownEmpIlce").html("<option class='disabled item' value=''>İlçe</option> ")
        }
    })
    //get today

    var dtToday = new Date();

    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();

    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
    
    var maxDate = year + '-' + month + '-' + day;
    
    //acceptance and cease of employement cannot be greater than today, initial values
    $('#istenCikis').attr('min', $("#IseGiris").attr("value"));
    $('#IseGiris').attr('max', maxDate);    
    $('#istenCikis').attr('max', maxDate);
    $('#istenCikis').attr('value', maxDate);
    
    //if date of acceptance change;
    $("#IseGiris").on('change', function() {
        var new_limit = $("#IseGiris").val()
        $('#istenCikis').attr('min', new_limit);
    });

    // parsing date for filling inputs with current values
    var placeholderDogumTarihi = $("#DogumTarihi").attr("value")
    var placeholderIseGiris =   $("#IseGiris").attr("value")
    var placeholderIstenCikis =   $("#istenCikis").attr("value")
    //slicing for current dates as placeholder 
    $("#IseGiris").attr("value", placeholderIseGiris.slice(0, 10));
    $("#DogumTarihi").attr("value", placeholderDogumTarihi.slice(0, 10));
    
    //checking if employee is still working or not
    if (placeholderIstenCikis =! null || placeholderIstenCikis == undefined){
        $("#istenCikis").attr("value", $("#istenCikis").attr("value").slice(0, 10));

    }
});



