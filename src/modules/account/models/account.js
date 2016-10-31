import nodegeocoder from 'node-geocoder';
import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate';
import validator from 'mongoose-validators';

const geocoder = nodegeocoder('google', 'https');

const METERS_IN_MILES = 1609.34;

/**
 * Postcode max length 9. e.g. AB12 34CD
 */
function validPostcodeLength(value) {
	return value && value.length <= 9;
}

/**
 * Check description character length
 */
function validTextLength(value) {
	return value.length < 300;
}

const accountSchema = new Schema({
	user: { type: Schema.Types.ObjectId },
	customer: String,

	accountname: {
		type: String,
		validate: [validator.isAlpha, 'Invalid Account Name']
	},

	description: {
		type: String,
		validate: [validTextLength, 'Description is too long']
	},

	image: {
		type: String
	},

	phonenumber: {
		type: String,
		validate: [validator.isNumeric, 'Invalid Phone Number']
	},

	address: {
		line1: {
			type: String,
			validate: [validator.isAlphanumeric, 'Invalid Address Line 1']
		},
		line2: {
			type: String,
			validate: [validator.isAlphanumeric, 'Invalid Address Line 2']
		},
		city: {
			type: String,
			validate: [validator.isAlpha, 'Invalid City']
		},
		postcode: {
			type: String,
			validate: [
				{ validator: validator.isAlphanumeric, message: 'Invalid Postcode' },
				{ validator: validPostcodeLength, message: 'Invalid Postcode' }
			]
		},
		location: {
			type: [Number],
			index: '2dsphere'
		},
		country: {
			type: String
		},
		country_code: {
			type: String
		}
	},

	currency: {
		type: String,
		default: 'gbp'
	}
}, {
	minimize: true,
	timestamps: true
});

/**
 * Get the full address
 */
accountSchema.virtual('fulladdress').get(function onGetFullAddress() {
	if (this.address.line1) {
		return `${this.address.line1},
				${this.address.line2},
				${this.address.city},
				${this.address.postcode}`;
	}
	return true;
});

accountSchema.pre('save', function (next) {
	// Set delivery radius. (miles * meteres in miles). Geocoder uses meteres
	// account.delivery.radius = parseInt(account.delivery.radius, 10) * METERS_IN_MILES;

	// if (account.delivery.is_free === true) account.delivery.free_over = undefined;
	// if (account.delivery.cost === 0) account.delivery.free_over = undefined;

	if (this.fulladdress) {
		geocoder.geocode(this.fulladdress, function (err, res) {
			if (err) return next(err);

			if (!res.length) {
				return next(new Error('Could not find the address entered'));
			}

			this.address.location = [res[0].latitude, res[0].longitude];
			this.address.country = res[0].country;
			this.address.country_code = res[0].countryCode;

			return next();
		});
	}

	return next();
});

accountSchema.set('toJSON', {
	virtuals: true,
	transform: (doc, ret) => {
		delete ret.id;
		delete ret.__v;
		return ret;
	}
});

/**
 * Pagination defaults
 * Add paginate to model
 */
paginate.paginate.options = {
	sort: 'accountname',
	lean: true,
	limit: 10
};

accountSchema.plugin(paginate);
export default mongoose.model('Account', accountSchema);
