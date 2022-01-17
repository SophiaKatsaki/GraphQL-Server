const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} =require('graphql');

//Teacher Type
const TeacherType = new GraphQLObjectType({
    name:'Teacher',
    fields: () => ({
        //their personal and unique id
        id: {type:GraphQLString},

        //their name
        name: {type:GraphQLString},

        //their phone number
        telephone: {type:GraphQLString}, 

        //their email
        email: {type:GraphQLString},

        //the subject that they teach
        //subject: {type:SubjectType}
            
    })
})

//Subject Type
/*const SubjectType = new GraphQLObjectType({
    name:'Subject',
    fields:() => ({
        //the unique code of the subject
        id: {Type:GraphQLString},

        //its name 
        name: {Type:GraphQLString},

        //compulsory or elective course
        iscompulsory: {Type:GraphQLString},

        //the semester that the subject belongs
        semester: {Type:GraphQLInt},

        //the department that the subject belongs to
        department: {Type:GraphQLString}

    })
})
*/


//Student Type
/*const StudentType = new GraphQLObjectType({
    name:'Student',
    fields:() => ({
        //their personal and unique id
        id: {Type:GraphQLString},

        //their name
        name: {Type:GraphQLString},

        //their email
        email: {Type:GraphQLString},

        //they department that they study in
        department:{Type:GraphQLString},

        //the year that they entered University
        register_year: {Type:GraphQLInt}
            
    })
})
*/



//our Root Query
const RootQuery=new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        teacher:{
            type:TeacherType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue,args)
            {
               return axios.get('http://localhost:3000/teachers/' + args.id)
               .then(res =>  res.data);
            }
       },
       teachers:{
        type:new GraphQLList(TeacherType),
        resolve(parentValue,args)
        {
            return axios.get('http://localhost:3000/teachers')
            .then(res =>  res.data);
        }
    }
    }
   
});

const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addTeacher:{
            type: TeacherType,
            args:{
                name: {type:new GraphQLNonNull(GraphQLString)},
                telephone: {type:new GraphQLNonNull(GraphQLString)},
                email: {type:new GraphQLNonNull(GraphQLString)}

            },
            resolve(parentValue,args){
              return axios.post('http://localhost:3000/teachers',
              {name:args.name,
               telephone:args.telephone,
               email:args.email})
               .then(res => res.data); 
            }
        },
        deleteTeacher:{
            type: TeacherType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue,args){
              return axios.delete('http://localhost:3000/teachers/'+args.id)
             .then(res => res.data); 
            }
        },
        editTeacher:{
            type: TeacherType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                telephone: {type:GraphQLString},
                email: {type:GraphQLString}

            },
            resolve(parentValue,args){
              return axios.patch('http://localhost:3000/teachers/' + args.id, args)
             .then(res => res.data); 
            }
        }
    
    }
})

module.exports=new GraphQLSchema({
    query: RootQuery,
    mutation:mutation

});