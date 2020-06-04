var express = require("express"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash");

var app = express();

mongoose.connect("mongodb+srv://metealpk:sru4pthM76dKmuW@cluster0-ucesk.mongodb.net/medCase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
// mongoose.connect("mongodb://localhost/medCase", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); //this should be after bodyParser for overriding
app.use(methodOverride("_method"));
app.use(flash());

var medCaseSchema = new mongoose.Schema({ 
        Ad: String,
        Soyad: String,
        DogumTarihi: Date,
        Cinsiyet: String,
        IseGiris: Date,
        IstenCikis: Date,
        EmpIl: String,
        EmpIlce: String,
        Aktif: Boolean,    
});

var Employees = mongoose.model("Employees", medCaseSchema);
//session
app.use(require("express-session")({
    secret: "need banana",
    resave: true,
    saveUninitialized: true,
}));

//passing flash messages to everywhere
app.use(function(req, res, next){
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})


//RESTFUL ROUTES
app.get("/", function (req, res){
    res.redirect("/employees");
    }
)

//INDEX ROUTE
app.get("/employees", function (req, res){
    Employees.find({}, function(err, employees){
        if(err){
            console.error(err);
        }
        else {
            res.render("index", { employees: employees });
        }
    });
})

//NEW ROUTE
app.get("/employees/new", function(req, res){
    res.render("new");
})

//CREATE ROUTE
app.post("/employees", function(req,res){
    //create employee
    req.body.employee.body = req.sanitize(req.body.employee.body);
    var newEmployee = req.body.employee
    if (newEmployee.Aktif){
        newEmployee.Aktif = true;
    } else { 
        newEmployee.Aktif = false;
    }
    Employees.create(newEmployee, function(err, newEmployee){
        if(err){
            req.flash("error", "Yeni Personelin Bilgilerini Kontrol Ediniz")
            res.render("new");
        } else{
            req.flash("success", "Personel başarıyla kayıtlara eklendi.")
            res.redirect("/employees");
        }
    });
    //then, redirect to the index
});



//EDIT ROUTE
app.get("/employees/:id/edit", function(req, res){
    Employees.findById(req.params.id, function(err, foundEmployee){
        if(err){
            res.redirect("/employees");
        } else {
            res.render("edit", {employee: foundEmployee});
        }
    });
});

//UPDATE ROUTE
app.put("/employees/:id", function(req, res){
    req.body.employee.body = req.sanitize(req.body.employee.body);

    var foundEmployee = req.body.employee
    if (foundEmployee.Aktif){
        foundEmployee.Aktif = true;
        foundEmployee.IstenCikis = null;
    } else { 
        foundEmployee.Aktif = false;
    }
    console.log(req.body.employee);
    Employees.findByIdAndUpdate(req.params.id, foundEmployee, function(err, updatedEmployee){
        if(err){
            req.flash("error", "Girilen Bilgileri Kontrol Ediniz, Çalışan Bilgileri Güncellenemedi.")
            res.redirect("/employees");

        } else {
            req.flash("success", "Personel başarıyla güncellendi.")
            res.redirect("/employees");
        }
    });
});


//DELETE ROUTE
app.delete("/employees/:id", function(req,res){
    // destroy blog post
    Employees.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Personel kayıtlardan silinemedi, lütfen sistem yöneticisine başvurun.")
            res.redirect("/employees");
        } else {
            //redirect to index
            req.flash("success", "Personel başarıyla kayıtlardan silindi.")
            res.redirect("/employees");
        }
    });
});

// listening the server
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("server started");
});

// //listening the server
// app.listen(3000, function(){
// 	console.log("server started");
// });