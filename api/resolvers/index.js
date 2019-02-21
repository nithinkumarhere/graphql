import Request from '../../models/request';
import request from 'request';

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
            console.log(kycID)
            request({
                method: 'GET',
                uri: 'http://35.184.211.155:3031/api/kycAsset/'+kycID,
                headers: {}
            }, function (error, response, body){
                if(!error && response.statusCode == 200){
                    console.log(JSON.parse(body))
                   // KycCollection.update({kycID:req.params.id},{$set:{respondedOn:timeStampFun()}})
                    //res.json(JSON.parse(body));
                }else{
                    res.json("fail")
                }
            })

            var changeObject = {kycId: input.kycId, requester: input.requester, requestedOn: input.requestedOn, respondedOn: "current Time", kycStatus: "Approved"};
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