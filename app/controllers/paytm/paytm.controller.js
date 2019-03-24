var checksum = require('./checksum');

module.exports = {
    getRequest: (req, res) => {
         res.render("paytm/index");
    },
    request: (req, res) =>{
         var paramlist = req.body;
         var paramarray = new Array();

         for(name in paramlist) {
             if( name === "PAYTM_MERCHANT_KEY"){
                 var PAYTM_MERCHANT_KEY = paramlist[name];
             }else {
                 paramarray[name] = paramlist[name]
             }
         }
         paramarray["CALLBACK_URL"] = "http://localhost:3000/api/paytm/response";
         checksum.genchecksum(paramarray, PAYTM_MERCHANT_KEY, (err, result) =>{
             if(err) console.log(err);
             res.render("paytm/request", {result});
         });
        },
       response: (req, res) =>{
           console.log(req.body);
           res.render("paytm/response")
       } 
}