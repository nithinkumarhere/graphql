import Request from '../../models/request';
import jwt from 'jsonwebtoken';
var requestify = require('requestify'); 

export const resolvers = {
    
    Query: {
        async getRequest(root, { _id }) {
            return await Request.findById(_id);
        },
        async allRequests() {
            return await Request.find();
        },
        async getToken() {
            const token = jwt.sign(
                { userId: "1", email: "nithin@gmail.com" },
                'secretkey',
                {
                    expiresIn: '1h'
                }
            );
            return token;
        }
    },
    Mutation: {
        async createRequest(root, { input }, req) {
            if (!req.isAuth) {
                throw new Error('Unauthenticated!');
            }
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

            var status = await requestify.get('http://35.188.108.193:3031/api/kycAsset/' + kycID).then(function (response) {
                    return [response.getBody().mobileNumber, response.getBody().passportNumber, response.getBody().homeCountryAddress, response.getBody().status];
            });

            //validate aadhar
            var aadharVal;
            if (status[2] == input.aadhar) {
                aadharVal = "Verified";
            }
            else {
                aadharVal = "Details Not Matched"  
            }
            
            //validate passport
            var passportVal;
            if (status[1] == input.passport) {
                passportVal = "Verified";
            }
            else {
                passportVal = "Details Not Matched"
            }

            //validate phone
            var phoneVal;
            if (status[0] == input.phone) {
                phoneVal = "Verified";
            }
            else {
                phoneVal = "Details Not Matched"
            }

            //validate KYC Status
            var kycVal;
            if(aadharVal == "Verified" && passportVal == "Verified" && phoneVal == "Verified"){
                kycVal = status[3]
            }
            else{
                kycVal = "Verification Failed"
            }

            var changeObject = { kycId: input.kycId, requester: input.requester, requestedOn: input.requestedOn, respondedOn: timeStampFun(), aadhar: aadharVal, passport: passportVal, phone: phoneVal, kycStatus: kycVal };
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
