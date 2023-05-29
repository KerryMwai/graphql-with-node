// https://zestradar.com/entertainment/10-movie-characters-that-were-ruined-by-wrong-casting/?adclid=0a390cc363d782f9ee09dc418d38b422
const express=require("express");
const app=express();
const expressGraphQl=require("express-graphql").graphqlHTTP

const games=[
    {id:1, name:"Net hunter", charcters:4},
    {id:2, name:"Elite killer", charcters:19},
    {id:3, name:"Bubble shooter", charcters:10},
    {id:4, name:"Chess", charcters:2},
    {id:5, name:"Fifa", charcters:32},
    {id:6, name:"Netball", charcters:2},
]


const participants=[
    {id:1, name:"John Doe", gameId:4, isparticipating:true},
    {id:2, name:"Bob",gameId:2, isparticipating:true},
    {id:3, name:"Chris",gameId:6, isparticipating:false},
    {id:4, name:"Mack",gameId:3, isparticipating:false},
]


const {
    GraphQLNonNull,
    GraphQLInt,
    GraphQLList,
    GraphQLString,
    GraphQLBoolean,
    GraphQLObjectType,
    GraphQLSchema
}=require("graphql");


const GameType=new GraphQLObjectType({
    name:"Game",
    description:"Represent of game type",
    fields:()=>({
        id:{type:GraphQLInt},
        name:{type:GraphQLNonNull(GraphQLString)},
        charcters:{type:GraphQLNonNull(GraphQLInt)},
        characters:{
            type:GameType,
            resolve:(game)=>{
                return participants.find(character=>character.gameId===game.id)
            }
        }
    })
})


const ParticipantType=new GraphQLObjectType(
    {
        name:"Participant",
        description:"Represent game type",
        fields:{
            id:{type:GraphQLNonNull(GraphQLString)},
            name:{type:GraphQLNonNull(GraphQLString)},
            gameId:{type:GraphQLInt},
            isparticipating:{type:GraphQLNonNull(GraphQLBoolean)},
            gamename:{
                type:GameType,
                resolve:(character)=>{
                    return games.find(game=>character.gameId===game.id)
                }
            }
        }
    }
)


const RootQueryType=new GraphQLObjectType({
    name:"Query",
    description:"Root Query",
    fields:{
        game:{
            description:"A single game",
            type:GameType,
            args:{
                id:{type:GraphQLInt}
            },
            resolve:(parent, args)=>{
                return games.find(game=>game.id===args.id)
            }
        },

        games:{
            description:"A list of games",
            type:GraphQLList(GameType),
            resolve:()=>games
        },

        gamer:{
            id:GraphQLInt,
            type:GameType,
            args:{
                id:{type:GraphQLInt}
            },
            resolve:(parent, args)=>{
                return participants.find(character=>character.id===args.id)
            }
        },

        gamers:{
            description:"List of all gamers",
            type: GraphQLList(ParticipantType),
            resolve:()=>participants
        }
    }
})



const RootMutationType=new GraphQLObjectType({
    name:"Mutation",
    description:"Root Mutation",
    fields:{
        addGamer:{
            name:"Add gamer",
            type:ParticipantType,
            args:{

                    name:{type:GraphQLNonNull(GraphQLString)},
                    gameId:{type:GraphQLNonNull(GraphQLInt)},
                    isparticipating:{type:GraphQLNonNull(GraphQLBoolean)}
            },
            resolve:(parent, args)=>{
                const gamer={id:participants.length+1, name:args.name, gameId:args.gameId, isparticipating:args.isparticipating}
                participants.push(gamer)

                return gamer;
            }

        }
    }
})


const schema=new GraphQLSchema({
    query:RootQueryType,
    mutation:RootMutationType
})

app.use("/graphql", expressGraphQl(
        {
            schema:schema,
            graphiql:true
        }
    )
)

app.listen(9000,()=>console.log("Server is listening"))

