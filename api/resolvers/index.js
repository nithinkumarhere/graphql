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

            function timeStampFun() {
                var now = new Date();
                var year = "" + now.getFullYear();
                var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
                var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
                var hour = "" + (now.getHours()); if (hour.length == 1) { hour = "0" + hour; }
                var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
                var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
                return day +'-'+ month +'-'+ year +' '+ hour +':'+ minute+':'+second;
            }
        //    var status = await requestify.get('http://35.184.211.155:3031/api/kycAsset/'+kycID).then(function (response) {
        //         return response.getBody().status;
        //     });
           // var changeObject = { kycId: input.kycId, requester: input.requester, requestedOn: input.requestedOn, respondedOn: timeStampFun(), kycStatus: status};
           
            var status = await requestify.get('http://35.184.211.155:3031/api/kycAsset/'+kycID).then(function (response) {
                return [response.getBody().mobileNumber, response.getBody().passportNumber, response.getBody().homeCountryAddress, response.getBody().status, response.getBody().address];
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
            var changeObject = { kycId: input.kycId, requester: input.requester, requestedOn: input.requestedOn, respondedOn: timeStampFun(), aadhar: aadharVal, passport: passportVal, phone: phoneVal, address: status[4], kycStatus: status[3] };
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