const { ObjectId } = require('mongodb');
const http=require('http');
const { log } = require('console');
const mongoClient=require('mongodb').MongoClient;

class tripsController{
    constructor(){
        this.db=null;
        this.url='mongodb+srv://egytour0:fvSrAe030lU66v3m@cluster0.c4mccsi.mongodb.net/'
        // this.url='mongodb://21a8beedfb4acea9d88aac47b3ad6feb:07920589@mongodb:27017/21a8beedfb4acea9d88aac47b3ad6feb'
    }
    async connectToDb(){
            await mongoClient.connect(this.url,{useNewUrlParser: true,useUnifiedTopology: true}).then(data=>{
                this.db=data.db('egyTour')
                console.log('connect');
                return
            })
            .catch(err=>{
                console.log(err);
            })
    }

    async addTrip(trip){
        await this.connectToDb().then(()=>{
            this.db.collection('trips').insertOne(trip)
        })
        .catch(err=>{return( err)} )
    }

    async removeTrip(tripName,tripType){
        await this.connectToDb().then(()=>{
            this.db.collection('trips').deleteOne({name:tripName,type:tripType})
        })
        .catch(err=>console.log(err) )
    }

    async updateTripPrice(tripName,tripType,tripPrice){
        await this.connectToDb().then(()=>{
            this.db.collection('trips').updateOne({name:tripName,type:tripType},{$set:{price:tripPrice}})
        })
        .catch(err=>console.log(err) )
    }

    async format(){
        await this.connectToDb().then(()=>{
            this.db.collection('trips').deleteMany({})
        })
        .catch(err=>console.log(err) )
    }

    async getAllTrips() {
    try {
        await this.connectToDb();
        const tripsCollection = this.db.collection("trips");
        const trips = await tripsCollection.find({}).toArray();
        return trips;
    } catch (err) {
        throw err;
    }
    }
    async getTripsAccordingToLocation(location) {
    try {
        await this.connectToDb();
        const tripsCollection = this.db.collection("trips");
        const trips = await tripsCollection.find({location:{$regex: location}}).toArray();
        return trips;
    } catch (err) {
        throw err;
    }
    }
    async getTripsAccordingToId(tripId) {
        const id=new ObjectId(tripId);
        try {
            await this.connectToDb();
            const tripsCollection = this.db.collection("trips");
            const trip = await tripsCollection.find({_id:id}).toArray();
            return trip;
        } catch (err) {
            throw err;
        }
        }
}

module.exports=tripsController