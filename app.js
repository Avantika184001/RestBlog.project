var bodyParser      = require("body-parser"),
	methodOveride   = require("method-override"),
	expressSanitizer= require("express-sanitizer"),
	mongoose        = require("mongoose"),
    express         = require("express"),
	app             = express();


//MONGOOSE CONF.
mongoose.connect("mongodb+srv://Avvu:akitnava@cluster0-vg86b.mongodb.net/test?retryWrites=true&w=majority", 
	{
useUnifiedTopology: true,
useNewUrlParser: true,
useFindAndModify: false
}).then(() => {
	console.log('Connected to DB');
}).catch(err => {
	console.log('ERROR:' , err.message);
});


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOveride("_method"));

var blogSchema = new mongoose.Schema
({
	name: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});


//MODEL CONF.
var Blog = mongoose.model("Blog" , blogSchema);
 

//RESTFULLROUTES

app.get( "/" , function(req, res){
   res.redirect("/blogs");
});


app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR!!!!");
		}
		else{
			res.render("index", {blogs: blogs});
		}
	});
});
//NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
      //create a blogs
	console.log(req.body);
	req.body.blog.body = req.sanitize(req.body.blog.body);
	console.log("=====");
	console.log(req.body);
	
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			console.log("Error");
		}
		else {
			//redirect to index
			res.redirect("/");
		}
	});
	});


//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");	
		}
		else
		{
			res.render("show", {blog :foundBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
		res.render("edit", {blog :foundBlog});
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	
 Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
	 if(err){
		 res.redirect("/blogs");
	 }
	 else{
		 res.redirect("/blogs/"+req.params.id);
	 }
 });
	
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

app.listen(3000, function(){
	console.log("server is working!!!");
});