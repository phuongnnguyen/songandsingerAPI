const {
	GraphQLID,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLList,
	GraphQLNonNull
} = require('graphql');
const mongoose = require('mongoose');
const Singer = require("../models/singer");
const Song = require('../models/song');
 
/*
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://phuongnguyen952501:phuonganh@songsingerapi-hhtzl.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
	console.log("DB connected");
  //client.close();
});
*/
const uri = "mongodb+srv://phuongnguyen952501:phuonganh@songsingerapi-hhtzl.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri);
mongoose.connection.once("open", () => console.log("DB connected"));
const SongType = new GraphQLObjectType({
	name: "SongType",
	fields: () => ({
		name: {type: GraphQLString},
		genre: {type: GraphQLString},
		id: {type: GraphQLID},
		singer: {
			type: SingerType,
			resolve(parent, args) {
				console.log(parent.authorid)
				return Singer.findById(parent.authorid);
			}
		}
	})
});

const SingerType = new GraphQLObjectType({
	name: "SingerType",
	fields: () => ({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		age: {type: GraphQLInt},
		songs: {
			type: GraphQLList(SongType),
			resolve(parent, args) {
				return Song.find({authorid: parent.id})
			}
		}
	})
});	

const RootQuery = new GraphQLObjectType({
	name: "RootQuery",
	fields: {
		song: {
			type: SongType,
			args: {id: {type: GraphQLID}},
			resolve(parent, args) {
				return Song.findById(args.id)
			}
		},
		singer: {
			type: SingerType,
			args: {id: {type: GraphQLID}},
			resolve(parent, args) {
				return Singer.findById(args.id)
			}
		},
		songs: {
			type: GraphQLList(SongType),
			resolve(parent, args) {
				return Song.find({});
			}
		},
		singers: {
			type: GraphQLList(SingerType),
			resolve(parent, args) {
				return Singer.find({});
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addSinger: {
			type: SingerType,
			args: {
				name: {type: GraphQLNonNull(GraphQLString)},
				age: {type: GraphQLNonNull(GraphQLInt)}
			},
			resolve(parent, args) {
				let singer = new Singer({
					name: args.name,
					age: args.age
				});
				return singer.save();
			}
		},
		addSong: {
			type: SongType,
			args: {
				name: {type: GraphQLNonNull(GraphQLString)},
				genre: {type: GraphQLNonNull(GraphQLString)},
				authorid: {type: GraphQLNonNull(GraphQLID)}
			},
			resolve(parent, args) {
				let song = new Song({
					name: args.name,
					genre: args.genre,
					authorid: args.authorid
				});
				return song.save();
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})








