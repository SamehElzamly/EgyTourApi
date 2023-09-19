const {ObjectId}= require ('mongodb')
const mongoClient=require('mongodb').MongoClient;
class usersController{
    constructor(){
        this.db=null;
        this.url='mongodb+srv://egytour0:fvSrAe030lU66v3m@cluster0.c4mccsi.mongodb.net/'
        // this.url='mongodb://15a.mongo.evennode.com:27019,15b.mongo.evennode.com:27019/21a8beedfb4acea9d88aac47b3ad6feb?replicaSet=eu-15'
    }

    connectToDb(){
        return new Promise((resolve,reject)=>{
            mongoClient.connect(this.url,{useNewUrlParser: true,useUnifiedTopology: true}).then(data=>{
                this.db=data.db('egyTour')
                resolve(this.db)
            })
            .catch(err=>{
                reject(err);
            })
        })
    }

    async newUser(user){
        await this.connectToDb().then(()=>{
            this.db.collection('users').insertOne(user).then(data=>{
            })
            .catch(err=>console.log(err))
        }).catch(err=>console.log(err))
    }
    logIn(user){
        return new Promise ((resolve,reject)=>{
            this.connectToDb().then(()=>{
            this.db.collection('users').findOne({email:user.email,password:user.password}).then((data)=>{
                    resolve(data)
                })
            .catch(err=>reject(err))
        }).catch(err=>reject(err))
        })
    }

    async getAllUsers(){
        console.log(1);
        let data=[]
        await this.connectToDb().then(()=>{
            console.log(2);
            data=this.db.collection('users').find({}).toArray()
            })
        return data
        }
        catch(err)
        {return(err) 
        }

    async getDataById(userId){
        const id=new ObjectId(userId)
        const db=await this.connectToDb();
        const data=await db.collection('users').find({_id:id}).project({password:0}).toArray();
        return data
    }
    async getDataByEmail(userEmail){
        try {
            const db=await this.connectToDb();
            const data=await db.collection('users').find({email:userEmail}).project({email:1}).toArray();
            return data
        }
        catch(err){
            return err
        }
    }

    // add trip to favorite or remove it from favourites
    async toggleFavTrip(userId,tripId){
        const id=new ObjectId(userId)
        let index=0;
        try{
            const db=await this.connectToDb();
            var data=await db.collection('users').find({_id:id}).project({favTrips:1}).toArray();
            let favTrips=data[0].favTrips
            await favTrips.forEach((trip,i)=>{{
                if(trip===tripId){
                    favTrips.splice(i,1)
                    index++
                }
            }})
            if(index===0){
                favTrips.push(tripId)
            }
            await db.collection('users').updateOne({_id:id},{$set:{favTrips:favTrips}})
            return favTrips
        }
        catch(err){
            return err
        }
    }
    // add trip to cart 
    async addToCart(userId,order){
        const idOfUser=new ObjectId(userId)
        const db=await this.connectToDb();
        let oldCart=await db.collection('users').find({_id:idOfUser}).project({cart:1}).toArray();
        let newCart=await oldCart[0].cart
        newCart.push(order);
        await db.collection('users').updateOne({_id:idOfUser},{$set:{cart:newCart}}).then(()=>{return 'succes'}).catch(err=>{return err})
    }
    async removeFromCart(userId,orderId){
        const idOfUser=new ObjectId(userId)
        let newCart=[]
        const db=await this.connectToDb();
        let data=await db.collection('users').find({_id:idOfUser}).toArray()
        let cart=data[0].cart
        await cart.forEach((trip,index)=>{
            if(trip.tripId!==orderId){
                newCart.push(cart[index])
            }
        })
        await db.collection('users').updateOne({_id:idOfUser},{$set:{cart:newCart}}).then(()=>{return( 'succes');}).catch(err=>{return err})
    }
}

module.exports=usersController