import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, unique: true, required: true },
    status: { type: Boolean, default: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnail: { type: [String], default: [] },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Assuming 'User' is the model name for your user schema
});

mongoose.set('strictQuery', false);
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model('products', productSchema);

export default productModel;