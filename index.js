const express=require('express');
const tripsController = require('./tripsController');
const usersController=require('./users');
const ratesController=require('./ratesController')
const cors=require('cors');
const bodyParser=require('body-parser')

const app=express()
const trips =new tripsController;
const users=new usersController;
const rates=new ratesController;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))

app.get('/getAllTrips',(req,res)=>{
    trips.getAllTrips().then(trips=>{
        res.status(200).send(trips)
    })
})
app.post('/getTripsAccordingToLocation',(req,res)=>{
    trips.getTripsAccordingToLocation(req.body.location).then(trips=>{
        res.status(200).send(trips)
    })
})

app.get('/discover/:tripId',(req,res)=>{
    trips.getTripsAccordingToId(req.params.tripId).then(response=>res.send(response))
})

app.post('/addTrip',(req,res)=>{
    const trip=req.body
    trips.addTrip(trip).then(()=>res.send('success'))
})

app.delete('/delTrip',(req,res)=>{
    const trip=req.body
    trips.removeTrip(trip.name,trip.type).then(()=>res.send('deleted'))
})

app.put('/updatePrice',(req,res)=>{
    const trip=req.body;
    trips.updateTripPrice(trip.name,trip.type,trip.price).then(()=>{
    res.redirect('/')
    })
    .catch(()=>{
        res.redirect('/err')
    })
})

app.get('/getAllUsers',(req,res)=>{
    users.getAllUsers().then(users=>{
        res.send(users)
    })
})

app.post('/newUser',(req,res)=>{
    const user=req.body
    users.newUser(user).then(()=>{
        res.redirect('/')
    })
})

app.post('/logIn',(req,res)=>{
    const user=req.body
    users.logIn(user).then((data)=>{
        res.redirect('/')
    })
})

app.get('/user/:userId',(req,res)=>{
    if(req.params.userId!=='null'){
        users.getDataById(req.params.userId).then(data=>{
            res.send(data)
        })
        .catch(err=>console.log(err))
    }
    else
    return 'no sign in operation'
})
app.post('/getId',(req,res)=>{
    users.getDataByEmail(req.body.userEmail).then(data=>{
        res.send(data)
    })
})

app.post('/toggleFavTrip',(req,res)=>{
    const body=req.body
    users.toggleFavTrip(body.userId,body.tripId).then((response)=>{res.send(response)})
})
app.post('/getTripsAccordingToId',(req,res)=>{
    const body=req.body
    trips.getTripsAccordingToId(body.tripId).then(response=>{
        res.send(response)
    }
    ).catch(err=>console.log(err))
})

app.post('/addToCart',(req,res)=>{
    users.addToCart(req.body.userId,req.body.order).then(res=>{return res}).catch(err=>res.send(err))
})

app.post('/removeFromCart',(req,res)=>{
    users.removeFromCart(req.body.userId,req.body.orderId).then(response=> res.send(response))
})
app.get('/getRates',(req,res)=>{
    rates.getRates().then(response=>res.send(response))
})
app.post('/postRate',(req,res)=>{
    rates.postRate(req.body.userName,req.body.rate).then(response=>res.send(response)).catch(err=>res.send(err))
})
app.listen(4000)
