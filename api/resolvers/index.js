import Request from '../../models/request';

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