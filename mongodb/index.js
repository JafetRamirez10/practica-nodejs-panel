const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/carsdb',{useUnifiedTopology:true,useNewUrlParser:true}).
then(()=>console.log('Conectado correctamente a MongoDB'))
.catch(()=>console.log('Error al conectarse a MongoDB'))

const carSchema =  new mongoose.Schema({
	company:String,
	model:String,
	price:Number,
	year:Number,
	sold:Boolean,
	extras:[String],
	date:{type:Date,default:Date.now}
})

const Car = mongoose.model('car',carSchema)
//createCar()
//getCars()
//getCompanyAndSoldFiltersCars()

//getMOreFilterCar()

getfFilterPriceCars()

getfFilterPricInNineCars()

async function getfFilterPriceCars(){
	const cars = await Car
	.find({price:{$gt:2000}})
	console.log(cars);
}

async function getfFilterPricInNineCars(){
	const cars = await Car
	.find({extras:{$in:'Automatic'}})
	console.log(cars)
}


async function getMOreFilterCar(){
	const cars = await Car
		.find({sold:false})
		.sort({price:-1})
		.limit(2)
		.select({company:1,model:1,price:1})
		console.log(cars)
}

async function getCompanyAndSoldFiltersCars(){
	const cars = await Car.find({company:'BMW',sold:false})
	console.log(cars)
}


async function getCars(){
	const cars = await Car.find()
	console.log(cars)
}

async function createCar(){
	const car =  new Car({
		company:'BMW2',
		model:'2005',
		price:'4005',
		year:'2016',
		sold:false,
		extras:['Automatic','4*4']
	})

	const result = await car.save()
	console.log(result)
}

