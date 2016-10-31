import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate';
import validator from 'mongoose-validators';

function nameValidation(key = 'Value') {
	return [
		validator.isAlpha({ message: `Invalid ${key}` }),
		validator.isLength({
			message: `${key} must be at least 2 characters`
		}, 2, 25)
	];
}

const userSchema = new Schema({
	firstname: {
		type: String,
		required: [true, 'Missing Firstname'],
		validate: nameValidation('Firstname')
	},
	lastname: {
		type: String,
		required: [true, 'Missing Lastname'],
		validate: nameValidation('Lastname')
	},
	email: {
		type: String,
		lowercase: true,
		index: true,
		required: [true, 'Missing Email Address'],
		validate: [validator.isEmail, 'Invalid Email']
	},
	password: {
		type: String,
		required: [true, 'Missing Password'],
		validate: [validator.isLength({ message: 'Password must be at least 8 characters' }, 8)]
	},
	hash: String,
	salt: String,
	reset_password_token: String,
	reset_password_expiry: String,
	resource: { type: String },
	roles: { type: Array, default: ['user'] }
});

/**
 * Compare the entered password to the stored password
 * @param {string} enteredPassword
 * @param {function} callback
 */
userSchema.methods.comparePassword = function (enteredPassword, callback) {
	bcrypt.compare(enteredPassword, this.password, (err, isMatch) => {
		if (err) return callback(err);
		return callback(null, isMatch);
	});
};

/**
 * User Data Model Virutals
 */
userSchema.virtual('fullname').get(function() {
	return `${this.firstname} ${this.lastname}`;
});

/**
 * Run when a new model has been created
 */
userSchema.pre('save', function (next) {
	const user = this;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(10, (saltErr, salt) => {
		if (saltErr) return next(saltErr);

		bcrypt.hash(user.password, salt, (hashErr, hash) => {
			if (hashErr) return next(hashErr);
			user.password = hash;
			return next();
		});
	});
});

/**
 * What to return when model is loaded
 */
userSchema.set('toJSON', {
	virtuals: true,
	transform: (doc, ret) => {
		delete ret.id;
		delete ret.__v;
		delete ret.password;
		delete ret.hash;
		delete ret.salt;
		delete ret.reset_password_token;
		delete ret.reset_password_expiry;
		return ret;
	}
});

/**
 * Pagination defaults
 * Add paginate to model
 */
paginate.paginate.options = {
	sort: 'lastname',
	lean: true,
	limit: 10
};

userSchema.plugin(paginate);
export default mongoose.model('User', userSchema);
