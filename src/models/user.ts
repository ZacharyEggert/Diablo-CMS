import { model, Schema } from 'mongoose';

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (username: string) => {
                    return /^[a-zA-Z0-9]+$/.test(username);
                },
                message:
                    '{VALUE} is not a valid username! Username can only contain letters and numbers!',
            },
        },
        password: {
            type: String,
            required: true,
            validate: {
                validator: function (password: string) {
                    return password.length >= 6 && password.length <= 20;
                },
                message:
                    '{VALUE} is not a valid password! Password must be between 6 and 20 characters long!',
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,

            validate: {
                validator: function (email: string) {
                    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
                        email
                    );
                },
                message: '{VALUE} is not a valid email!',
            },
        },
        isAccessRevoked: {
            type: Boolean,
            default: false,
        },
    },
    {
        _id: true,
        timestamps: true,
    }
);

userSchema.methods.revokeAccess = function () {
    this.isAccessRevoked = true;
    return this.save();
};

userSchema.methods.setPassword = function (password: string) {
    this.password = password;
    return this.save();
};

const User = model('User', userSchema);

export default User;
