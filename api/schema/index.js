import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from '../resolvers/index';

const typeDefs = `
        type Request {
            _id: ID!
            kycId: String!
            requester: String!
            requestedOn: String!
            respondedOn: String
            aadhar: String!
            passport: String!
            phone: String!
            kycStatus: String
        }
        type Query {
            getRequest(_id: ID!): Request
            allRequests: [Request]
            getToken: String
        }
        input RequestInput {
            kycId: String!
            requester: String!
            requestedOn: String!
            respondedOn: String
            aadhar: String!
            passport: String!
            phone: String!
            kycStatus: String
        }
        type Mutation {
            createRequest(input: RequestInput) : Request
            updateRequest(_id: ID!, input: RequestInput): Request
            deleteRequest(_id: ID!) : Request
        }
`;

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

export default schema;