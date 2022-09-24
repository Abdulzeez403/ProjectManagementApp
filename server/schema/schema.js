const Projects = require('../models/Project');
const Clients = require('../models/Client');


const {GraphQLID,
  GraphQLObjectType,
  GraphQLString, 
  GraphQLSchema,
  GraphQLList, 
  GraphQLNonNull,
  GraphQLEnumType}= require("graphql");
// const Client = require('../models/Client');

const ClientType = new GraphQLObjectType({
  name: "client",
  description: "This represent a client",
  fields: ()=>({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    phone: {type: GraphQLString},
  }),
});
const ProjectType = new GraphQLObjectType({
  name: "project",
  description: "This represent a client",
  fields: ()=>({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    status: {type: GraphQLString},
    client: {
      type: ClientType,
    resolve(parent, args){
      return Clients.findById(parent.clientId)
    }}
  }
 )
});


const  RootQueryType = new GraphQLObjectType({
  name: 'RootRQueryType',
  description: "ROOT QUERY",
  fields: ()=>({
    clients:{
      type: new GraphQLList(ClientType),
      description: "List of all clinet",
      resolve: (parent, args) =>{
        return Clients.find();   }
    },
    client: {
      type: ClientType ,
      description: "get a Single Book",
      args:{ id: {type: GraphQLID}},
      resolve: ()=>{
        return Clients.findById(arg.id)

      }
    },

    projects:{
      type: new GraphQLList(ProjectType),
      description: "List of all project",
      resolve: ()=>{
        return Projects.find();
  
      }
    },
    project: {
      type: ProjectType ,
      description: "get a Single project ",
      args:{ id: {type: GraphQLID}},
      resolve: (parent, args)=>{
        return Projects.findById(args.id)

      }
    },
   })
});

//Mutation
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields:{
    addClient:{
     type: ClientType,
     description: "Adding a new client",
     args:{
      name: {type: GraphQLNonNull(  GraphQLString)},
      email: {type: GraphQLNonNull(  GraphQLString)},
      phone: {type: GraphQLNonNull(  GraphQLString)},
     },
     resolve:(parent, args)=>{
      const Client  = new Clients({
        name: args.name,
        email: args.email,
        phone: args.phone
      });
      return Client.save();
     }
    },

    deleteClient:{
      type: ClientType,
      description: "Delete a client",
      args:{
        id: {type: GraphQLID}
      }, 
      resolve:(parent, args)=>{
     return Clients.findByIdAndRemove(args.id);
      }
    },

    addProject:{
      type: ProjectType,
      description: "add project",
      args:{
        name: {type: GraphQLNonNull(GraphQLString)},
        description: {type: GraphQLNonNull(GraphQLString)},
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
               new:{value: 'Not Started'},
               progress:{value: 'In Progress'},
               complete:{value: 'completed'},
            }
          }),
          defaultValue:" Not  Started", 
        },
        clientId:  {type: GraphQLNonNull(GraphQLID)}
      },
      resolve:(parent, args)=>{
        const Project  = new Projects({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId
        });
        return Project.save();
      }
    },

    deleteProject:{
      type: ProjectType,
      description: "Delete a project",
      args:{
        id: {type: GraphQLID}
      }, 
      resolve:(parent, args)=>{
     return Projects.findByIdAndRemove(args.id);
      }
    },


    UpdateProject:{
      type: ProjectType,
      description: "Update a project",
      args:{
        id: {type:GraphQLNonNull( GraphQLID)},
        name: {type:GraphQLString},
        description: {type: GraphQLString},
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatusUpdATE',
            values: {
               new: {value: 'Not Started'},
               progess: {value: 'In Progress'},
               complete: {value: 'completed'},
            }
          }),
        },
      }, 
      resolve:(parent, args)=>{
     return Projects.findByIdAndUpdate(
      args.id,
      {
        $set:{
          name: args.name,
          description: args.description,
          status: args.status
        },
      },
      {new : true}
     );
      }
    },




  }
});

module.exports =  new GraphQLSchema({
  query: RootQueryType,
  mutation,
  
})
  