const { response } = require("express");
const express= require("express");

const https=require("https");
const bodyParser=require("body-parser");

const app=express();

app.use(bodyParser.urlencoded({extended: true}));


app.get("/",function(req,res){

    res.sendFile(__dirname+"/index.html");
     
});

app.post("/",function(req,res){

    const query=req.body.cityName;
    const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid=b89b37cac92028836cf1c94176ea646d"
    https.get(url,function(response){
      

        response.on("data",function(data){

            const weatherdata=JSON.parse(data);
            const longitude=weatherdata.coord.lon;
            const latitude=weatherdata.coord.lat;
            const Name=weatherdata.name;
            const country =weatherdata.sys.country;
           
            const link="https://api.openweathermap.org/data/2.5/air_pollution?lat="+latitude+"&lon="+longitude+"&appid=b89b37cac92028836cf1c94176ea646d";
            
            https.get(link,function(response){
              
                response.on("data",function(data){
                const pollutiondata=JSON.parse(data);
                const airqualityindex=pollutiondata.list[0].main.aqi;
                const CO=pollutiondata.list[0].components.co;
                const NO=pollutiondata.list[0].components.no;
                const NO2=pollutiondata.list[0].components.no2;
                const o3=pollutiondata.list[0].components.o3;
                const so2=pollutiondata.list[0].components.so2;

                res.write('   <div  style="color:black;text-align:center; background-color:white;height:100%;") no-repeat center center/cover;" >')

                if(airqualityindex==1)
                {
                     res.write("<h1>Air Quality in "+Name+", "+country+": Good</h1>"); 
                }
                else if(airqualityindex==2)
                {
                    res.write("<h1>Air Quality in "+Name+", "+country+": Fair</h1>");
                }
                else if(airqualityindex==3)
                {
                    res.write("<h1>Air Quality in "+Name+", "+country+": Moderate</h1>");
                }
                else if(airqualityindex==4)
                {
                    res.write("<h1>Air Quality in "+Name+", "+country+": Poor</h1>");
                }
                else
                {
                    res.write( " <h1>Air Quality in "+Name+", "+country+": Very Poor</h1>");
                }

                res.write("<h3>Air Quality Index :"+airqualityindex+"</h3>");

                res.write("<h3>Components :</h3>");
                
                res.write("<h4>Carbon monoxide:  "+CO+"</h4>");
                res.write("<h4>Nitric oxide:  "+NO+"</h4>");
                res.write("<h4>Nitrogen dioxide:  "+NO2+"</h4>");
                res.write("<h4>Ozone:  "+o3+"</h4>");
                res.write("<h4>Sulfur dioxide:  "+so2+"</h4>");
               
               
                res.send();
    
                })
            })
            

        })

    })
})



app.listen(3000,function(){

    console.log("Server is running on port 3000");

})
