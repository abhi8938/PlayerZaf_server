
getCustomer(1, (customer) => {
 
  if (customer.isGold) {
    getTopMovies((movies) => {
     
      sendEmail(customer.email, movies, () => {
        
      });
    });
  }
});

// Async and await
async function mailSender(){
  try{
   const customer = await getCustomer(1);
   if(customer.isGold){
   const movies = await getTopMovies();
   const sendmail = await sendEmail(customer.email, movies);
  }
  }
  catch(err){
    console.log('error', err.message);
  }
}
mailSender();
function getCustomer(id) {
  return new Promise((resolve, reject) =>{
    setTimeout(() => {
      resolve({ 
        id: 1, 
        name: 'Mosh Hamedani', 
        isGold: true, 
        email: 'email' 
      });
      
    }, 4000); 
    console.log('Customer');
  });
 
}

function getTopMovies() {
  new Promise (( resolve, reject) =>{
    setTimeout(() => {
      resolve(['movie1', 'movie2']);
      console.log('Top movies ');
    }, 4000);
  }); 
}

function sendEmail(email, movies) {
  new Promise(( resolve, reject ) => {
    setTimeout(() => {
      resolve();
      console.log('Email sent...');
    }, 4000);
  }) 
}