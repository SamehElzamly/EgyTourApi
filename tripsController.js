const { ObjectId } = require('mongodb');

const mongoClient=require('mongodb').MongoClient;

class tripsController{
    constructor(){
        this.db=null;
        this.url='mongodb+srv://sameh:FJozl74GEoiwefcY@cluster0.zlprvyt.mongodb.net/'
    }
    async connectToDb(){
            await mongoClient.connect(this.url,{useNewUrlParser: true,useUnifiedTopology: true}).then(data=>{
                this.db=data.db('egyTour')
                return
            })
            .catch(err=>{
                return(err);
            })
    }

    async addTrip(trip){
        await this.connectToDb().then(()=>{
            this.db.collection('trips').insertOne(trip)
        })
        .catch(err=>console.log(err) )
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