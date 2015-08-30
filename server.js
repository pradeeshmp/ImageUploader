var express = require("express");
var app = express();

var bodyParser = require('body-parser');

var mongojs = require("mongojs");
//imagedata is the collection in mongodb. 
var db = mongojs("imagedata", ["imagedata"]);

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));

app.use(express.static(__dirname + "/public"));
app.use("/UploadImage", express.static(__dirname + "/public"));
app.use("/Gallery", express.static(__dirname + "/public"));
app.use("/scripts", express.static(__dirname + "/scripts"));
app.use("/views", express.static(__dirname + "/views"));
app.use("/styles", express.static(__dirname + "/styles"));


 
/*Use it, If you don't have mongodb installed locally. 
  Comment mongodb related code to use this array and
  uncomment imageData related code.
*/
/*var imageData = [{  url: "data:image/jpeg;base64,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",
                    label:"Angular JS"
                  },
                  {
                    url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAUVBMVEXw8PB1Xsn29/JyW8iOftBsUsfa1uiUhdLV0eZpTsZvVsfe3Or4+fP09fKWh9Lb2OmIds7r6u5jRsT8/fTDvOCMe8+AbMyqn9iGdM6mm9eildZ45waaAAACCElEQVR4nO3daW7bUAyFUdeW7EhyPCRVOux/od1AgTIA+cCg51vAxTsZ/hn04SBJkiRJkv7rtvPgnoOBx2mZh/b2Mlp4OX0b2kxISEhISEhISEhISEhISEhISEhISEhISEhISEhISPjX1wd6v62noc3na+BZryHgNl3+3e1jGttjvwWe9StEPC+BH+k6vUd+1Wldt9Cr9mNIOAf+LU5TaCuvzFcREtZESFi1lRchYdVWXoSEVVt5ERJWbeVFSFi1lRchYdVWXoSEVVt5ERJWbeVFSFi1lRchYdVWXoSfEr4FThwsj8jWM3QPYhv8qsPzJdJ98LMSX5VZzz/4zAgJ+0dI2D9Cwv4REvaPkLB/hIT9IyTsHyFh/wgJ+0dI2D9Cwv59aeFr3pmA2PGC4cAfkdMS+8/IQYiPyD2IafSHEI6XyOWP5R441xE7IrL0vN4SOrmSOJUZIWHNVGaEhDVTmRES1kxlRkhYM5UZIWHNVGaEhDVTmRES1kxlRkhYM5UZIWHNVGaEhDVTmRES1kxldr3FnhX4NobEqWChUw/bFHnW+v0+dCp2gCJ26mGOfQnLOnYqeBcj9DGfnmVeb+kZIWH/CAn7R0jYP0LC/hES9o+QsH+EhP0jJOwfIWH/CAn7R0jYv6gwcuqhZ+seEm6PyKmHlu2/Yx9JidzhaFreZ24kSZIkSfpi/QGBd3xcwVmFWAAAAABJRU5ErkJggg==",
                    label: "Angular Pic"
                   }
                ];*/

/*Get method -- To get the data or collection of images.
  It will gets slow with no. of images.
  Please try to save small size of image.
  Some optimization we can perform on this mechanism.
  1. HTTP compression.
  2  Pagination.
*/
app.get('/GetImages', function (req, res) {
  //res.json(imageData);
  db.imagedata.find(function (error, doc) {
  	res.json(doc);
  })
});

app.post('/UploadImageData', function (req, res) {
  //imageData.push(res.body);
  db.imagedata.insert(req.body, function(error, doc){
  	res.json(doc);	
  });
  
});

//if you change port no. here, Please update base tag too. 
app.listen(3000);
console.log("Server has started");