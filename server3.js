const express=require("express")
const expressGraphQl=require("express-graphql").graphqlHTTP
const app=express()

const {
GraphQLBoolean,
GraphQLInt,
GraphQLString,
GraphQLObjectType,
GraphQLList,
GraphQLNonNull,
GraphQLSchema
}=require("graphql")

const users=[
    {id:1, name:"User one", postId:3,isSuperUser:false},
    {id:2, name:"User two", postId:1,isSuperUser:false},
    {id:3, name:"User three", postId:2,isSuperUser:true},
    {id:4, name:"User four", postId:5,isSuperUser:false},
    {id:5, name:"User five", postId:4,isSuperUser:true},
    {id:6, name:"User six", postId:2,isSuperUser:false},
    {id:7, name:"User seven", postId:1,isSuperUser:false},
    {id:8, name:"User eight", postId:3,isSuperUser:true},
    {id:9, name:"User nine", postId:2,isSuperUser:true},
    {id:10, name:"User ten", postId:3,isSuperUser:false},
    {id:11, name:"User eleven", postId:2,isSuperUser:false},
]


const posts=[
    {id:1, title:"Elixir conference", body:"Educating Africans on the importance and why they should get into technology as faster as possible", userId:[3,5,7]},
    {id:2, title:"Laravel vs Elixir", body:"Comparison of Laravel vs elixir and how they can be used together", userId:[4,7,8]},
    {id:3, title:"Java", body:"Why people should not deem Java as a depricating language", userId:[2,3,5,6,7]},
    {id:4, title:"Javascript", body:"This is the ost loved scripting language in the world and contains beautiful frameworks linke angular, react, vue and node", userId:[1,3,7,9]},
    {id:5, title:"Dart", body:"The best of all the languages for both mobile and cross platform os applications and web applications", userId:[5,6,8,11]},
]

const UserType=new GraphQLObjectType({
    name:"User",
    description:"Represents a user",
    fields:()=>({
        id:{type:GraphQLNonNull(GraphQLInt)},
        name:{type:GraphQLNonNull(GraphQLString)},
        postId:{type:GraphQLInt},
        isSuperUser:{type:GraphQLNonNull(GraphQLBoolean)},
        post:{
            type:PostType,
            resolve:(user)=>{
                return posts.find((post=>user.postId===post.id));
            }
        }

    })
})

const PostType=new GraphQLObjectType({
    name:"Post",
    description:"Represents the post type",
    fields:{
        id:{type:GraphQLNonNull(GraphQLInt)},
        title:{type:GraphQLNonNull(GraphQLString)},
        body:{type:GraphQLNonNull(GraphQLString)},
        userId:{type:GraphQLList(GraphQLInt)},
        users:{
            type:GraphQLList(UserType),
            resolve:(post)=>{
                const postusers=[];
                post.userId.forEach(id=>{
                    for(var i=0;i<users.length; i++){
                        if(users[i].id===id){
                            postusers.push(users[i])
                        }
                    }
                })

                return postusers
            }
        }
    }
})


const QueryRootType=new GraphQLObjectType({
    name:"Query",
    description:"Root Query",
    fields:{
        post:{
            type:PostType,
            description:"A single post type",
            args:{
                id:{type:GraphQLInt}
            },
            resolve:(parent,args)=>{
                return posts.find(post=>post.id===args.id)    
            }
        },

        user:{
            type:UserType,
            description:"Single user",
            args:{
                id:{type:GraphQLInt}
            },
            resolve:(parent, args)=>{
                return users.find(user=>user.id===args.id)
            }
        },

        posts:{
            type:GraphQLList(PostType),
            resolve:()=>posts  
        },

        users:{
            type:GraphQLList(UserType),
            resolve:()=>users
        }
    }
})

const RootMutationType=new GraphQLObjectType({
    name:"Mutation",
    description:"Root Mutation",
    fields:{
        addPost:{
            description:"Adding a Post",
            type:PostType,
            args:{
                title:{type:GraphQLString},
                body:{type:GraphQLString},
                userId:GraphQLList(GraphQLInt)
            },
            resolve:(parent,args)=>{
            const post={id:posts.length+1, title:args.title,body:args.body,userId:args.userId}

                posts.push(post)

                return post
            }
        }
    }
})

const schema=new GraphQLSchema({
    mutation:RootMutationType,
    query:QueryRootType
})

app.listen(4000, ()=>console.log("Server is running"));

app.use("/graphql",expressGraphQl({
    schema:schema,
    graphiql:true
}))