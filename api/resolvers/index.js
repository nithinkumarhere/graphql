import Request from '../../models/request';
var requestify = require('requestify'); 

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
                return [response.getBody().mobileNumber, response.getBody().passportNumber, response.getBody().homeCountryAddress, response.getBody().status];
            });
            //validate aadhar
            var aadharVal;
            if(status[2]==input.aadhar){
                aadharVal="Verified";
            }
            else{
                aadharVal="Not Verified"
            }
            //validate passport
            var passportVal;
            if (status[1] == input.passport) {
                passportVal = "Verified";
            }
            else {
                passportVal = "Not Verified"
            }
            //validate phone
            var phoneVal;
            if (status[0] == input.phone) {
                phoneVal = "Verified";
            }
            else {
                phoneVal = "Not Verified"
            }
            var changeObject = { kycId: input.kycId, requester: input.requester, requestedOn: input.requestedOn, respondedOn: "current Time", aadhar: aadharVal, passport: passportVal, phone: phoneVal, kycStatus: status[3] };
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