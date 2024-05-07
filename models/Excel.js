const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Excel = new Schema({
    no: {type: Number},
    website: { type: String, default: 'Default' },
    website_link: { type: String, default: 'Default' },
    position: { type: String, default: 'Default' },
    dimensions: { type: String, default: 'Default' },
    platform: { type: String, default: 'Default' },
    demo: [{ type: String, default: 'Default' }],
    demo_link: [{ type: String, default: 'Default' }],
    buying_method: { type: String, default: 'Default' },
    homepage: { type: String, default: 'Default' },
    price: { type: String, default: 'Default' },
    cross_site_roadblock: { type: String, default: 'Default' },
    ctr: { type: String, default: 'Default' },
    est: { type: String, default: 'Default' },
    type: {type: Number},
    createdBy: {type: Schema.Types.ObjectId, ref: 'Account', default: 'Default'},
    updatedBy: {type: Schema.Types.ObjectId, ref: 'Account', default: 'Default'}

}, {
    timestamps: true,
});


module.exports = mongoose.model('Excel', Excel);