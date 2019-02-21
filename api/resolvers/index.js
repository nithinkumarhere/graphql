import Request from '../../models/request';
import request from 'request';
var requestify = require('requestify'); 
var MyApp = {};
export const resolvers = {
    
    Query: {
        async getRequest(root, { _id }) {
            return await Request.findById(_id);
        },
        async allRequests() {
            return await Request.find();
        }
    },
    Mutation: {
       async createRequest(root, { input }) {
            var kycID = input.kycId;
           var status = await requestify.get('http://35.184.211.155:3031/api/kycAsset/'+kycID).then(function (response) {
                return response.getBody().status;
            });
            var changeObject = { kycId: input.kycId, requester: input.requester, requestedOn: input.requestedOn, respondedOn: "current Time", kycStatus: status};
            return await Request.create(changeObject);   
        },
        async updateRequest(root, { _id, input }) {
            return await Request.findOneAndUpdate({ _id }, input, { new: true })
        },
        async deleteRequest(root, { _id }) {
            return await Request.findOneAndRemove({ _id });
        }
    }
};