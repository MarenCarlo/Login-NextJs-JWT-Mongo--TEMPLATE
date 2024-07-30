import { model, Schema, models } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'El Nombre de Usuario es Obligatorio.'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'La Contraseña es Obligatoria.'],
        unique: true,
        trim: true
    },
}, {
    timestamps: true
});

export default models.Users || model('Users', userSchema);