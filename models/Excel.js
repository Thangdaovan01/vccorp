const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Excel = new Schema({
    no: {type: Number},
    website: { type: String, default: '' },
    website_link: { type: String, default: '' },
    position: { type: String, default: '' },
    dimensions: { type: String, default: '' },
    platform: { type: String, default: '' },
    demo: [{ type: String, default: '' }],
    demo_link: [{ type: String, default: '' }],
    buying_method: { type: String, default: '' },
    homepage: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    xuyentrang: { type: Number, default: 0 },
    chuyenmuc: { type: Number, default: 0 },
    week: { type: Number, default: 0 },
    month: { type: Number, default: 0 },
    quarter: { type: Number, default: 0 },
    cross_site_roadblock: { type: String, default: '' },
    ctr: { type: String, default: '' },
    est: { type: String, default: '' },
    note: { type: String, default: '' },

    type: {type: Number},
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
    updatedBy: {type: Schema.Types.ObjectId, ref: 'User'}

}, {
    timestamps: true,
});


module.exports = mongoose.model('Excel', Excel);