const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} =require('graphql');

//Subject Type
const SubjectType = new GraphQLObjectType({
    name:'Subject',
    fields:() => ({
        //the unique code of the subject
        id: {type:GraphQLString},

        //its name 
        name: {type:GraphQLString},

        //compulsory or elective course
        iscompulsory: {type:GraphQLString},

        //the semester that the subject belongs
        semester: {type:GraphQLInt},

        //the department that the subject belongs to
        department: {type:GraphQLString}

    })
})

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

        //the subjects that they teach
       subjects_Of_teacher:
       {
           type: new GraphQLList(GraphQLInt)
        
       }
            
    })
})


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
        },
    },
    subject:{
            type: SubjectType,
            args:{ 
                id:{type:GraphQLString}
            },
            resolve(parentValue,args)
            {
                return axios.get('http://localhost:3000/subjects/'+args.id)
                .then(res => res.data);
            },
        },
        subjects:{
                type: new GraphQLList(SubjectType),
                resolve(parentValue,args)
                {
                    return axios.get('http://localhost:3000/subjects')
                    .then( res => res.data);
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
                email: {type:new GraphQLNonNull(GraphQLString)},
                subjects_Of_teacher: {type: new GraphQLList(GraphQLInt)}

            },
            resolve(parentValue,args){
              return axios.post('http://localhost:3000/teachers',
              {name:args.name,
               telephone:args.telephone,
               email:args.email,
               subjects_Of_teacher:args.subjects_Of_teacher})
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
                email: {type:GraphQLString},
                subjects_Of_teacher: {type: new GraphQLList(GraphQLInt)}

            },
            resolve(parentValue,args){
              return axios.patch('http://localhost:3000/teachers/' + args.id, args)
             .then(res => res.data); 
            }
        },

        addSubject:{
            type: SubjectType,
            args:{
                name: {type:new GraphQLNonNull(GraphQLString)},
                iscompulsory: {type:new GraphQLNonNull(GraphQLString)},
                semester: {type:new GraphQLNonNull(GraphQLInt)},
                department: {type: new GraphQLNonNull (GraphQLString)}

            },
            resolve(parentValue,args){
              return axios.post('http://localhost:3000/subjects',
              {name:args.name,
               iscompulsory:args.iscompulsory,
               semester:args.semester,
               department: args.department})
               .then(res => res.data); 
            }
        },
        deleteSubject:{
            type: SubjectType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue,args){
              return axios.delete('http://localhost:3000/subjects/'+args.id)
             .then(res => res.data); 
            }
        },
        editSubject:{
            type: SubjectType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                iscompulsory: {type:GraphQLString},
                semester: {type: GraphQLInt},
                department: {type:GraphQLString}

            },
            resolve(parentValue,args){
              return axios.patch('http://localhost:3000/subjects/' + args.id, args)
             .then(res => res.data); 
            }
        } 

    } 

})

module.exports=new GraphQLSchema({
    query: RootQuery,
    mutation:mutation

});
