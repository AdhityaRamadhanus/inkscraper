const graphql = require('graphql')
const mongoResolver = require('./resolver')
const resolver = mongoResolver
var MixedType = new graphql.GraphQLScalarType({
  name: 'mixed',
  escription: 'stringified json object that holds mongoose mixed type',
  serialize: (value) => {
    return value
  },
  parseValue: (value) => {
    return value
  },
  parseLiteral: (ast) => {
    if (ast.kind !== graphql.Kind.STRING) {
      throw new graphql.GraphQLError('Query error: Can only parse strings got a: ' + ast.kind, [ast])
    }
    return ast.value
  }
})
var JobsType = new graphql.GraphQLObjectType({
  name: 'Job',
  fields: {
    id: {
      type: graphql.GraphQLID
    },
    title: {
      type: graphql.GraphQLString
    },
    company: {
      type: graphql.GraphQLString
    },
    location: {
      type: graphql.GraphQLString
    }
  }
})

var JobsDetailType = new graphql.GraphQLObjectType({
  name: 'JobDetails',
  fields: {
    id: {
      type: graphql.GraphQLID
    },
    title: {
      type: graphql.GraphQLString
    },
    logo: {
      type: graphql.GraphQLString
    },
    description: {
      type: graphql.GraphQLString
    },
    other_details: {
      type: MixedType
    },
    company: {
      type: graphql.GraphQLString
    },
    location: {
      type: graphql.GraphQLString
    },
    detail_url: {
      type: graphql.GraphQLString
    }
  }
})

var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    jobs: {
      type: new graphql.GraphQLList(JobsType),
      resolve: resolver.getAll
    },
    jobsId: {
      type: JobsDetailType,
      args: {
        id: {
          name: 'Jobs Id',
          type: graphql.GraphQLID
        }
      },
      resolve: resolver.getOne
    },
    searchJobs: {
      type: new graphql.GraphQLList(JobsType),
      resolve: resolver.searchJobs
    }
  }
})

module.exports = new graphql.GraphQLSchema({
  query: queryType
})

