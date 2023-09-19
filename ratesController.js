

const mongoClient =require('mongodb').MongoClient
class ratesController{
    constructor(){
        this.db=null;
        this.url='mongodb+srv://egytour0:fvSrAe030lU66v3m@cluster0.c4mccsi.mongodb.net/'
        // this.url='mongodb://15a.mongo.evennode.com:27019,15b.mongo.evennode.com:27019/21a8beedfb4acea9d88aac47b3ad6feb?replicaSet=eu-15'
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
    async postRate(userName,rate){
        await this.connectToDb().then(()=>{
            this.db.collection('rates').insertOne({name:userName,rate:rate})
        })
        .catch(err=>{
            console.log(err)
        })
        return 'succes'
    }
    async getRates(){
        return await this.connectToDb().then(()=>{
            return this.db.collection('rates').find({}).toArray()
        })
    }
}
module.exports=ratesController